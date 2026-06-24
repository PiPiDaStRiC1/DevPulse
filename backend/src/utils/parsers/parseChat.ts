import type { Chat } from "@shared/types";

export const parseChat = (chat: any, currentUserId: number): Chat => {
    const participant = chat.participants?.find(
        (p: { userId: number; lastReadAt: string }) => p.userId === currentUserId,
    );

    const lastReadAt = participant?.lastReadAt ?? new Date(0).toISOString();

    const collocutor = chat.collocutor?.id === currentUserId ? chat.user : chat.collocutor;

    return {
        id: chat.id,
        collocutor,
        lastMessage: chat.messages[0] || null,
        unreadCount: chat.unreadCount ?? 0,
        updatedAt: chat.updatedAt,
        lastReadAt,
        userId: chat.userId,
    };
};
