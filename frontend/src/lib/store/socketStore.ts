import { create } from "zustand";
import { io, type Socket } from "socket.io-client";
import type { SocketMessagePayload, SocketPostPayload } from "@shared/types";

const WS_URL = import.meta.env["VITE_WS_URL"] || "http://localhost:4000";
const socket: Socket = io(WS_URL, { transports: ["websocket"], autoConnect: true });

interface SocketState {
    joinRoom: (roomId: string) => void;
    sendMessageWithWS: ({ chatId, message }: SocketMessagePayload) => void;
    publishPostWithWS: ({ post }: SocketPostPayload) => void;
    socket: Socket;
}

export const useSocketStore = create<SocketState>(() => ({
    joinRoom: (roomId: string) => {
        if (!socket) return;
        socket.emit("room:join", roomId);
    },
    sendMessageWithWS: ({ chatId, message }: SocketMessagePayload) => {
        const text = message.text?.trim();
        if (!text) return;

        socket.emit("chat:message", { chatId, message });
    },
    publishPostWithWS: ({ post }: SocketPostPayload) => {
        socket.emit("post:publish", { post });
    },
    socket: socket,
}));
