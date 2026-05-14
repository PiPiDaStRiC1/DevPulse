export interface UserSummary {
    id: number;
    username: string;
    handle: string;
    avatar: string | null;
    isVerified: boolean;
}

export interface Message {
    id?: number;
    chatId: number;
    senderId: number;
    text: string;
    createdAt: Date | string;
    seen: boolean;
}

export interface Chat {
    id: number;
    collocutor: UserSummary;
    lastMessage: Message;
    unreadCount: number;
    userId: number; // for identifying the owner of the chat
    updatedAt: Date | string; // last activity for filtering/sorting chats by time
    lastReadAt: Date | string;
    // ISO string for the last time the current user read messages in this chat
}

export interface ChatDTO {
    collocutorId: number;
    lastMessage: MessageDTO;
}

export interface MessageDTO {
    chatId?: number;
    senderId: number;
    text: string;
}