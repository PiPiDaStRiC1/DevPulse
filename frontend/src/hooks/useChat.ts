import { useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useSession, useSocket } from "@/hooks";
import { apiClient } from "@/lib/api";
import { socket } from "@/lib/store";
import toast from "react-hot-toast";
import type { Chat, Message, SocketMessagePayload, SocketReadChatPayload } from "@shared/types";

export const useChat = () => {
    const { user: me } = useSession();
    const { sendMessageWithWS, readChatWithWS } = useSocket();
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

    const { mutate: sendMessage } = useMutation({
        mutationFn: async (text: string) => {
            const trimmed = text.trim();
            if (!trimmed || !me || !id) throw new Error("Invalid payload");

            const message = await apiClient.postOneMessage({
                text: trimmed,
                senderId: me.id,
                chatId: Number(id),
            });

            sendMessageWithWS({ chatId: id, message });

            return message;
        },
        onMutate: async (text: string) => {
            await queryClient.cancelQueries({ queryKey: ["messages", id] });
            await queryClient.cancelQueries({ queryKey: ["chats"] });

            const previousMessages = queryClient.getQueryData<Message[]>(["messages", id]);
            const previousChats = queryClient.getQueryData<Chat[]>(["chats"]);

            const trimmed = text.trim();
            if (!trimmed || !me || !id) return { previousMessages, previousChats };

            const optimisticId = -Date.now(); // for optimistic message
            const optimisticMessage: Message = {
                id: optimisticId,
                chatId: Number(id),
                senderId: me.id,
                text: trimmed,
                createdAt: new Date().toISOString(),
                seen: false,
            };

            queryClient.setQueryData<Message[]>(
                ["messages", id],
                (oldData: Message[] | undefined) => {
                    if (!oldData) return [optimisticMessage];
                    return [...oldData, optimisticMessage];
                },
            );

            queryClient.setQueryData<Chat[]>(["chats"], (oldData: Chat[] | undefined) => {
                if (!oldData) return oldData;
                return oldData.map((c) =>
                    String(c.id) === String(id)
                        ? {
                              ...c,
                              lastMessage: optimisticMessage,
                              updatedAt: optimisticMessage.createdAt,
                          }
                        : c,
                );
            });

            return { previousMessages, previousChats, optimisticId };
        },
        onError: (_err, _variables, context) => {
            if (context?.previousMessages) {
                queryClient.setQueryData<Message[]>(["messages", id], context.previousMessages);
            }
            if (context?.previousChats) {
                queryClient.setQueryData<Chat[]>(["chats"], context.previousChats);
            }
            toast.error("Failed to send message");
        },
        onSuccess: (realMessage, _variables, context) => {
            if (!realMessage) return;

            queryClient.setQueryData<Message[]>(
                ["messages", id],
                (oldData: Message[] | undefined) => {
                    if (!oldData) return [realMessage];
                    return oldData.map((m) => {
                        if (m.id === context?.optimisticId) {
                            return { ...realMessage, seen: m.seen || realMessage.seen };
                        }
                        return m;
                    });
                },
            );

            queryClient.setQueryData<Chat[]>(["chats"], (oldData: Chat[] | undefined) => {
                if (!oldData) return oldData;
                return oldData.map((c) =>
                    String(c.id) === String(id)
                        ? { ...c, lastMessage: realMessage, updatedAt: realMessage.createdAt }
                        : c,
                );
            });
        },
    });

    useEffect(() => {
        const handler = ({ chatId, message }: SocketMessagePayload) => {
            queryClient.setQueryData<Message[]>(
                ["messages", chatId],
                (oldData: Message[] | undefined) => {
                    if (!oldData) return [message];
                    if (message.id && oldData.some((m) => m.id === message.id)) return oldData;
                    return [...oldData, message];
                },
            );
        };

        socket.on("chat:message:new", handler);
        return () => {
            socket.off("chat:message:new", handler);
        };
    }, [queryClient]);

    // Update chats list dynamically when a message arrives
    useEffect(() => {
        const handler = ({ chatId, message }: SocketMessagePayload) => {
            queryClient.setQueryData<Chat[]>(["chats"], (oldChats: Chat[] | undefined) => {
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

    useEffect(() => {
        const handler = ({ chatId }: SocketReadChatPayload) => {
            if (!me || !chatId) return;
            queryClient.setQueryData<Message[]>(["messages", chatId], (old) => {
                if (!old) return old;
                return old.map((m) => (m.senderId === me.id ? { ...m, seen: true } : m));
            });
        };

        socket.on("chat:read:new", handler);
        return () => {
            socket.off("chat:read:new", handler);
        };
    }, [me, queryClient]);

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
        readChatWithWS,
        messagesContainerRef,
    };
};
