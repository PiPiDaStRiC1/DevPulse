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
    };
};

export const getChats = async (_req: Request, res: Response<ApiResponse<Chat[]>>) => {
    try {
        const chats = await prisma.chat.findMany({
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
                unreadCount: true,
                updatedAt: true,
            },
        });

        return res.status(200).json({ success: true, data: chats.map(parseChat) });
    } catch (error) {
        console.error("Error getting all chats: ", error);
        return res.status(500).json({ success: false, error: "Failed to fetch chats" });
    }
};

export const postChat = async (req: Request<{}, {}, ChatDTO>, res: Response<ApiResponse<Chat>>) => {
    try {
        const { collocutorId, lastMessage, unreadCount } = req.body;

        const chat = await prisma.chat.create({
            data: { unreadCount, messages: { create: lastMessage }, collocutorId },
        });

        await prisma.message.create({
            data: { text: lastMessage.text, senderId: lastMessage.senderId, chatId: chat.id },
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
                unreadCount: true,
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
