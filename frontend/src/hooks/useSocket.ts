import { useSocketStore } from "@/lib/store";

export const useSocket = () => {
    const socket = useSocketStore((state) => state.socket);
    const setSocket = useSocketStore((state) => state.setSocket);
    const clearSocket = useSocketStore((state) => state.clearSocket);
    const sendMessage = useSocketStore((state) => state.sendMessage);
    const joinRoom = useSocketStore((state) => state.joinRoom);

    return { socket, setSocket, clearSocket, joinRoom, sendMessage };
};
