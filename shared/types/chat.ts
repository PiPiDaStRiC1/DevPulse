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
    createdAt: Date;
    delivered: boolean | null; // server-side delivery flag
}

export interface Chat {
    id: number;
    collocutor: UserSummary;
    lastMessage: Message;
    unreadCount: number;
    userId: number; // for identifying the owner of the chat
    updatedAt: Date; // last activity for filtering/sorting chats by time
}

export interface ChatDTO {
    collocutorId: number;
    unreadCount: number;
    lastMessage: MessageDTO;
}

export interface MessageDTO {
    chatId?: number;
    senderId: number;
    text: string;
}