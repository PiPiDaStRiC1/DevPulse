import { useSocketStore } from "@/lib/store";

export const useSocket = () => {
    const sendMessageWithWS = useSocketStore((state) => state.sendMessageWithWS);
    const publishPostWithWS = useSocketStore((state) => state.publishPostWithWS);
    const readChatWithWS = useSocketStore((state) => state.readMessagesWithWS);
    const joinRoom = useSocketStore((state) => state.joinRoom);
    const sendTypingStatusWithWS = useSocketStore((state) => state.sendTypingStatusWithWS);

    return {
        joinRoom,
        sendMessageWithWS,
        publishPostWithWS,
        readChatWithWS,
        sendTypingStatusWithWS,
    };
};
