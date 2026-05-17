import type { Message, Post } from "./index";

export interface SocketMessagePayload {
    chatId: string;
    message: Message;
}

export interface SocketPostPayload {
    post: Post;
}

export interface SocketReadChatPayload {
    chatId: string;
}

export interface SocketConnection {
    userId: number;
}

export interface SocketTypingMessagePayload {
    chatId: string;
    isTyping: boolean;
}