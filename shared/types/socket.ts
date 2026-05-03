import type { Message, Post } from "./index";

export interface SocketMessagePayload {
    chatId: string;
    message: Message;
}

export interface SocketPostPayload {
    post: Post;
}
