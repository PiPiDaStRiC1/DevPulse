import { useCallback, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useSession, useSocket } from "@/hooks";
import { apiClient } from "@/lib/api";
import { socket } from "@/lib/store";
import toast from "react-hot-toast";
import type { Chat, Message, SocketMessagePayload } from "@shared/types";

export const useChat = () => {
    const { user: me } = useSession();
    const { sendMessageWithWS, joinRoom } = useSocket();
    const queryClient = useQueryClient();
    const { id } = useParams<{ id: string }>();
    const isMe = Boolean(me?.id === id);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    const {
        data: chat,
        isLoading: isLoadingChat,
        isError: isErrorChat,
    } = useQuery<Chat>({
        queryKey: ["chats", id],
        queryFn: () => apiClient.getOneChat(Number(id!)),
        enabled: !!id,
    });

    const {
        data: chatMessages,
        isLoading: isLoadingMessages,
        isError: isErrorMessages,
    } = useQuery<Message[]>({
        queryKey: ["messages", id!],
        queryFn: () => apiClient.getAllMessagesByChatId(Number(id!)),
        enabled: !!id,
    });

    const { mutate: readChat } = useMutation({
        mutationKey: ["chats", id, "read"],
        mutationFn: (chatId: number) => apiClient.readChat(chatId),
        onMutate: async (chatId: number) => {
            await queryClient.cancelQueries({ queryKey: ["messages", String(chatId)] });
            await queryClient.cancelQueries({ queryKey: ["chats"] });

            const prevMessages = queryClient.getQueryData<Message[]>(["messages", String(chatId)]);
            const prevChat = queryClient.getQueryData<Chat>(["chats", String(chatId)]);
            const prevChats = queryClient.getQueryData<Chat[]>(["chats"]);

            if (prevMessages) {
                queryClient.setQueryData<Message[]>(
                    ["messages", String(chatId)],
                    prevMessages.map((m) => ({ ...m, seen: true })),
                );
            }
            if (prevChat) {
                queryClient.setQueryData<Chat>(["chats", String(chatId)], {
                    ...prevChat,
                    unreadCount: 0,
                    lastMessage: prevChat.lastMessage,
                    lastReadAt: new Date().toISOString(),
                });
            }
            if (prevChats) {
                queryClient.setQueryData<Chat[]>(
                    ["chats"],
                    prevChats.map((c) => (c.id === prevChat?.id ? { ...c, unreadCount: 0 } : c)),
                );
            }

            return { prevMessages, prevChat, prevChats };
        },
        onError: (_err, _variables, context) => {
            if (context?.prevMessages) {
                queryClient.setQueryData(["messages", String(id)], context.prevMessages);
            }
            if (context?.prevChat) {
                queryClient.setQueryData(["chats", String(id)], context.prevChat);
            }
            if (context?.prevChats) {
                queryClient.setQueryData(["chats"], context.prevChats);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["chats"] });
        },
    });

    useEffect(() => {
        if (!id) return;

        joinRoom(id);

        const onConnect = () => {
            joinRoom(id);
        };

        socket.on("connect", onConnect);

        return () => {
            socket.off("connect", onConnect);
        };
    }, [id, joinRoom]);

    const sendMessage = useCallback(
        async (text: string) => {
            const trimmed = text.trim();
            if (!trimmed || !me || !id) return;

            try {
                const message = await apiClient.postOneMessage({
                    text: trimmed,
                    senderId: me.id,
                    chatId: Number(id),
                });

                sendMessageWithWS({ chatId: id, message });

                queryClient.setQueryData(["messages", id], (oldData: Message[] | undefined) => {
                    if (!oldData) return [message];
                    if (message.id && oldData.some((m) => m.id === message.id)) return oldData;
                    return [...oldData, message];
                });

                // preview for last message in Whispers list
                queryClient.setQueryData(["chats"], (oldChats: Chat[] | undefined) => {
                    if (!oldChats) return oldChats;
                    return oldChats.map((c) =>
                        String(c.id) === String(id)
                            ? { ...c, lastMessage: message, updatedAt: message.createdAt }
                            : c,
                    );
                });
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (_error) {
                toast.error("Failed to send message");
            }
        },
        [id, me, queryClient, sendMessageWithWS],
    );

    useEffect(() => {
        const handler = ({ chatId, message }: SocketMessagePayload) => {
            queryClient.setQueryData(["messages", chatId], (oldData: Message[] | undefined) => {
                if (!oldData) return [message];
                if (message.id && oldData.some((m) => m.id === message.id)) return oldData;
                return [...oldData, message];
            });
        };

        socket.on("chat:message:new", handler);
        return () => {
            socket.off("chat:message:new", handler);
        };
    }, [queryClient]);

    // Update chats list dynamically when a message arrives
    useEffect(() => {
        const handler = ({ chatId, message }: SocketMessagePayload) => {
            queryClient.setQueryData(["chats"], (oldChats: Chat[] | undefined) => {
                if (!oldChats) return oldChats;
                return oldChats.map((c) => {
                    if (String(c.id) !== String(chatId)) return c;

                    const isActiveChatWindow = String(c.id) === String(id);
                    return {
                        ...c,
                        lastMessage: message,
                        updatedAt: message.createdAt,
                        unreadCount: isActiveChatWindow ? 0 : (c.unreadCount ?? 0) + 1,
                    };
                });
            });
        };

        socket.on("chat:message:new", handler);
        return () => {
            socket.off("chat:message:new", handler);
        };
    }, [id, queryClient]);

    return {
        chatId: id,
        me,
        isMe,
        chat,
        isLoadingChat,
        isErrorChat,
        chatMessages,
        isLoadingMessages,
        isErrorMessages,
        sendMessage,
        readChat,
        messagesContainerRef,
    };
};
