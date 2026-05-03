import { useCallback, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useSession, useSocket } from "@/hooks";
import { apiClient } from "@/lib/api";
import toast from "react-hot-toast";
import type { Chat, Message, SocketMessagePayload } from "@shared/types";

export const useChat = () => {
    const { user: me } = useSession();
    const { sendMessageWithWS, socket } = useSocket();
    const queryClient = useQueryClient();
    const [draft, setDraft] = useState("");
    const { id } = useParams<{ id: string }>();
    const isMe = Boolean(me?.id === id);

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

    const handleSubmit = useCallback(
        async (e: React.SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();

            const text = draft.trim();
            if (!text || !me || !id) return;

            try {
                const message = await apiClient.postOneMessage({
                    text,
                    senderId: me.id,
                    chatId: Number(id),
                });

                sendMessageWithWS({ chatId: id, message });
                queryClient.setQueryData(["messages", id], (oldData: Message[] | undefined) => {
                    if (!oldData) return [message];
                    if (message.id && oldData.some((m) => m.id === message.id)) return oldData;
                    return [...oldData, message];
                });

                setDraft("");
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                toast.error("Failed to send message");
            }
        },
        [draft, id, me, queryClient, sendMessageWithWS],
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
    }, [socket, queryClient]);

    return {
        id,
        me,
        isMe,
        chat,
        isLoadingChat,
        isErrorChat,
        chatMessages,
        isLoadingMessages,
        isErrorMessages,
        draft,
        setDraft,
        handleSubmit,
    };
};
