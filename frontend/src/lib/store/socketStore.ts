import { create } from "zustand";
import { io, type Socket } from "socket.io-client";
import toast from "react-hot-toast";
import type {
    SocketMessagePayload,
    SocketPostPayload,
    Acknowledgement,
    SocketReadChatPayload,
    SocketTypingMessagePayload,
} from "@shared/types";

const WS_URL = import.meta.env["VITE_WS_URL"] || "http://localhost:4000";
export const socket: Socket = io(WS_URL, {
    transports: ["websocket"],
    autoConnect: false,
    auth: { token: null },
});

interface SocketState {
    joinRoom: (roomId: string) => void;
    sendMessageWithWS: ({ chatId, message }: SocketMessagePayload) => void;
    publishPostWithWS: ({ post }: SocketPostPayload) => void;
    readMessagesWithWS: ({ chatId }: SocketReadChatPayload) => void;
    sendTypingStatusWithWS: ({ chatId, isTyping }: SocketTypingMessagePayload) => void;
}

export const useSocketStore = create<SocketState>(() => ({
    joinRoom: (roomId: string) => {
        if (!socket) return;
        socket.emit("room:join", roomId, (res: Acknowledgement) => {
            if (!res.ok) {
                toast.error(res.error);
                return;
            }
        });
    },
    sendTypingStatusWithWS: ({ chatId, isTyping }: SocketTypingMessagePayload) => {
        socket.emit("user:typing", { chatId, isTyping });
    },
    sendMessageWithWS: ({ chatId, message }: SocketMessagePayload) => {
        const text = message.text?.trim();
        if (!text) return;

        socket.emit("chat:message", { chatId, message });
    },
    readMessagesWithWS: ({ chatId }: SocketReadChatPayload) => {
        socket.emit("chat:read", { chatId });
    },
    publishPostWithWS: ({ post }: SocketPostPayload) => {
        socket.emit("post:publish", { post }, (res: Acknowledgement) => {
            if (!res.ok) {
                toast.error(res.error);
                return;
            }
        });
    },
}));
