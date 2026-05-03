import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useSocket } from "./useSocket";
import { useEffect } from "react";

export const useSocketBootstrap = () => {
    const { joinRoom } = useSocket();
    const {
        data: chats,
        isLoading,
        isError,
    } = useQuery({ queryKey: ["chats"], queryFn: apiClient.getAllChats, staleTime: 5 * 60 * 1000 });

    useEffect(() => {
        if (!chats) return;

        chats.forEach((chat) => joinRoom(String(chat.id)));
    }, [chats, joinRoom]);

    return { chats, isLoading, isError };
};
