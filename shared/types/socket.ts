import type { Message } from "./chat";

export interface SocketMessagePayload {
    chatId: string;
    message: Message;
}
