import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useSocket } from "./useSocket";

export const useSocketBootstrap = () => {
    const { joinRoom } = useSocket();
    const {
        data: chats,
        isLoading,
        isError,
    } = useQuery({ queryKey: ["chats"], queryFn: apiClient.getAllChats, staleTime: Infinity });

    if (!isLoading && !isError && chats) {
        chats.forEach((chat) => joinRoom(chat.id));
    }

    return { chats, isLoading, isError };
};
