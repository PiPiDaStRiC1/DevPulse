import { create } from "zustand";
import { io, type Socket } from "socket.io-client";

const WS_URL = import.meta.env["VITE_WS_URL"] || "http://localhost:4000";
const socket: Socket = io(WS_URL, { transports: ["websocket"] });

interface SocketState {
    socket: Socket | null;
    setSocket: (socket: Socket) => void;
    joinRoom: (roomId: number) => void;
    sendMessage: (message: string) => void;
    clearSocket: () => void;
}

export const useSocketStore = create<SocketState>((set) => ({
    socket: null,
    setSocket: (socket) => set({ socket }),
    joinRoom: (roomId: number) => {
        if (!socket) return;
        socket.emit("chat:join", roomId);
    },
    sendMessage: (message: string) => {
        const text = message.trim();
        if (!text) return;

        socket.emit("chat:message", text);
    },
    clearSocket: () => set({ socket: null }),
}));
