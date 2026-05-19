import { useSocketStore } from "@/lib/store";

export const useSocket = () => {
    const sendMessageWithWS = useSocketStore((state) => state.sendMessageWithWS);
    const publishPostWithWS = useSocketStore((state) => state.publishPostWithWS);
    const readChatWithWS = useSocketStore((state) => state.readMessagesWithWS);
    const sendRoomCreateWithWS = useSocketStore((state) => state.sendRoomCreateWithWS);
    const joinRoom = useSocketStore((state) => state.joinRoom);
    const sendTypingStatusWithWS = useSocketStore((state) => state.sendTypingStatusWithWS);

    return {
        joinRoom,
        sendRoomCreateWithWS,
        sendMessageWithWS,
        publishPostWithWS,
        readChatWithWS,
        sendTypingStatusWithWS,
    };
};
