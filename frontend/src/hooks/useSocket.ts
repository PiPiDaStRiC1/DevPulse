import { useSocketStore } from "@/lib/store";

export const useSocket = () => {
    const sendMessageWithWS = useSocketStore((state) => state.sendMessageWithWS);
    const publishPostWithWS = useSocketStore((state) => state.publishPostWithWS);
    const joinRoom = useSocketStore((state) => state.joinRoom);

    return { joinRoom, sendMessageWithWS, publishPostWithWS };
};
