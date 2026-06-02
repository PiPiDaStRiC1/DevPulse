import type { Message, Post, Comment } from "./index";

export interface SocketMessagePayload {
    chatId: string;
    message: Message;
}

export interface SocketPostPayload {
    post: Post;
}

export interface SocketCommentPayload {
    comment: Comment;
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

export interface SocketRoomCreatePayload {
    chatId: string;
    collocutorId: number;
}
