import { prisma } from "@/helpers";
import type { Response, Request } from "express";
import type { ApiResponse } from "@shared/types";
import type { Chat, ChatDTO } from "@shared/types";

const parseChat = (chat: any): Chat => {
    return {
        id: chat.id,
        collocutor: chat.collocutor,
        lastMessage: chat.messages[0] || null,
        unreadCount: chat.unreadCount,
        updatedAt: chat.updatedAt,
        userId: chat.userId,
    };
};

const resolveCollocutor = (chat: any, userId: number) => {
    if (chat.collocutor?.id === userId) {
        return chat.user;
    }

    return chat.collocutor;
};

const getUnreadCount = async (chatId: number, userId: number) => {
    const participant = await prisma.chatParticipant.findUnique({
        where: { chatId_userId: { chatId, userId } },
        select: { lastReadAt: true },
    });

    const lastReadAt = participant?.lastReadAt ?? new Date().toISOString();

    return prisma.message.count({
        where: { chatId, createdAt: { gt: lastReadAt }, senderId: { not: userId } },
    });
};

export const getChats = async (req: Request, res: Response<ApiResponse<Chat[]>>) => {
    try {
        const { userId } = req.user!;

        const rawChats = await prisma.chat.findMany({
            where: { OR: [{ userId }, { collocutorId: userId }] },
            select: {
                id: true,
                messages: { orderBy: { createdAt: "desc" }, take: 1 },
                collocutor: {
                    select: {
                        id: true,
                        username: true,
                        handle: true,
                        avatar: true,
                        isVerified: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        username: true,
                        handle: true,
                        avatar: true,
                        isVerified: true,
                    },
                },
                updatedAt: true,
                userId: true,
            },
        });

        const chats = await Promise.all(
            rawChats.map(async (chat) => {
                const unreadCount = await getUnreadCount(chat.id, userId);
                return { ...chat, collocutor: resolveCollocutor(chat, userId), unreadCount };
            }),
        );

        return res.status(200).json({ success: true, data: chats.map(parseChat) });
    } catch (error) {
        console.error("Error getting all chats: ", error);
        return res.status(500).json({ success: false, error: "Failed to fetch chats" });
    }
};

export const getOneChat = async (req: Request, res: Response<ApiResponse<Chat>>) => {
    try {
        const { userId } = req.user!;
        const { id } = req.params;

        const chatId = Number(id);

        const chat = await prisma.chat.findFirstOrThrow({
            where: { id: chatId, OR: [{ userId }, { collocutorId: userId }] },
            select: {
                id: true,
                messages: { orderBy: { createdAt: "desc" }, take: 1 },
                collocutor: {
                    select: {
                        id: true,
                        username: true,
                        handle: true,
                        avatar: true,
                        isVerified: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        username: true,
                        handle: true,
                        avatar: true,
                        isVerified: true,
                    },
                },
                userId: true,
                updatedAt: true,
            },
        });

        const unreadCount = await getUnreadCount(chat.id, userId);
        const resolvedChat = { ...chat, collocutor: resolveCollocutor(chat, userId), unreadCount };

        return res.status(200).json({ success: true, data: parseChat(resolvedChat) });
    } catch (error) {
        console.error("Error getting all chats: ", error);
        return res.status(500).json({ success: false, error: "Failed to fetch chats" });
    }
};

export const postChat = async (req: Request<{}, {}, ChatDTO>, res: Response<ApiResponse<Chat>>) => {
    try {
        const { userId } = req.user!;

        const { collocutorId, lastMessage } = req.body;

        if (!collocutorId) {
            return res.status(400).json({ success: false, error: "collocutorId is required" });
        }

        const existing = await prisma.chat.findFirst({
            where: {
                OR: [
                    { userId: userId, collocutorId: collocutorId },
                    { userId: collocutorId, collocutorId: userId },
                ],
            },
        });

        if (existing) {
            const fullExisting = await prisma.chat.findUnique({
                where: { id: existing.id },
                select: {
                    id: true,
                    messages: { orderBy: { createdAt: "desc" }, take: 1 },
                    collocutor: {
                        select: {
                            id: true,
                            username: true,
                            handle: true,
                            avatar: true,
                            isVerified: true,
                        },
                    },
                    updatedAt: true,
                },
            });

            if (!fullExisting) {
                return res.status(404).json({ success: false, error: "Chat not found" });
            }

            return res.status(200).json({ success: true, data: parseChat(fullExisting) });
        }

        const chat = await prisma.chat.create({
            data: { userId, messages: { create: lastMessage }, collocutorId },
        });

        const fullChat = await prisma.chat.findUnique({
            where: { id: chat.id },
            select: {
                id: true,
                messages: { orderBy: { createdAt: "desc" }, take: 1 },
                collocutor: {
                    select: {
                        id: true,
                        username: true,
                        handle: true,
                        avatar: true,
                        isVerified: true,
                    },
                },
                updatedAt: true,
            },
        });

        if (!fullChat) {
            return res.status(404).json({ success: false, error: "Chat not found after creation" });
        }

        return res.status(201).json({ success: true, data: parseChat(fullChat) });
    } catch (error) {
        console.error("Error creating chat: ", error);
        return res.status(500).json({ success: false, error: "Failed to create chat" });
    }
};

export const patchChat = async (req: Request<{ id: string }>, res: Response<ApiResponse<Chat>>) => {
    try {
        const { userId } = req.user!;
        const { id } = req.params;
        const chatId = Number(id);

        const chat = await prisma.chat.update({
            where: { id: chatId, OR: [{ userId }, { collocutorId: userId }] },
            data: {
                participants: {
                    update: {
                        where: { chatId_userId: { chatId, userId: userId } },
                        data: { lastReadAt: new Date().toISOString() },
                    },
                },
            },
            select: {
                id: true,
                messages: { orderBy: { createdAt: "desc" }, take: 1 },
                collocutor: {
                    select: {
                        id: true,
                        username: true,
                        handle: true,
                        avatar: true,
                        isVerified: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        username: true,
                        handle: true,
                        avatar: true,
                        isVerified: true,
                    },
                },
                updatedAt: true,
                userId: true,
            },
        });

        const unreadCount = await getUnreadCount(chatId, userId);
        const resolvedChat = { ...chat, collocutor: resolveCollocutor(chat, userId), unreadCount };

        return res.status(200).json({ success: true, data: parseChat(resolvedChat) });
    } catch (error) {
        console.error("Error patching chat: ", error);
        return res.status(500).json({ success: false, error: "Failed to patch chat" });
    }
};