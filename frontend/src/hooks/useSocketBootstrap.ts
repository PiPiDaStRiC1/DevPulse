import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useSocket } from "./useSocket";
import { useEffect } from "react";
import { useSession } from "./useSession";
import { socket } from "@/lib/store";
import toast from "react-hot-toast";

export const useSocketBootstrap = () => {
    const { isAuthenticated } = useSession();
    const { joinRoom } = useSocket();
    const queryClient = useQueryClient();
    const {
        data: chats,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["chats"],
        queryFn: apiClient.getAllChats,
        staleTime: 5 * 60 * 1000,
        enabled: isAuthenticated,
    });

    useEffect(() => {
        const onConnectError = (err: Error) => {
            console.error(err);
            toast.error("WebSocket connection error. Real-time features may not work.");
        };

        socket.on("connect_error", onConnectError);

        return () => {
            socket.off("connect_error", onConnectError);
        };
    }, []);

    useEffect(() => {
        if (!chats) return;
        chats.forEach((chat) => joinRoom(String(chat.id)));
    }, [chats, joinRoom]);

    useEffect(() => {
        const onConnect = () => {
            if (!chats) return;
            chats.forEach((chat) => joinRoom(String(chat.id)));
        };

        socket.on("connect", onConnect);

        return () => {
            socket.off("connect", onConnect);
        };
    }, [chats, joinRoom]);

    useEffect(() => {
        const onNewMessage = () => {
            // Don`t trigger current chat room, recalculate unread badges in whispers list
            queryClient.invalidateQueries({ queryKey: ["chats"] });
        };

        socket.on("chat:message:new", onNewMessage);

        return () => {
            socket.off("chat:message:new", onNewMessage);
        };
    }, [queryClient]);

    return { chats, isLoading, isError };
};
