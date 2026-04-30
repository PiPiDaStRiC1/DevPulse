import { useQuery } from "@tanstack/react-query";
import { CHATS } from "@/lib/constants";
import { useSocket } from "./useSocket";

export const useSocketBootstrap = () => {
    const { joinRoom } = useSocket();
    const {
        data: chats,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["chats"],
        queryFn: async () => {
            return CHATS;
        },
        staleTime: Infinity,
    });

    if (!isLoading && !isError && chats) {
        chats.forEach((chat) => joinRoom(chat.id));
    }

    return { chats, isLoading, isError };
};
