import { useSocketStore } from "@/lib/store";

export const useSocket = () => {
    const socket = useSocketStore((state) => state.socket);
    const sendMessageWithWS = useSocketStore((state) => state.sendMessageWithWS);
    const publishPostWithWS = useSocketStore((state) => state.publishPostWithWS);
    const joinRoom = useSocketStore((state) => state.joinRoom);

    return { socket, joinRoom, sendMessageWithWS, publishPostWithWS };
};
