import { prisma } from "@/helpers";
import type { Response, Request } from "express";
import type { ApiResponse } from "@shared/types";
import type { Message } from "@shared/types";

export const getMessages = async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse<Message[]>>,
) => {
    try {
        const { id } = req.params;

        const chatId = Number(id);

        const messages = await prisma.message.findMany({ where: { chatId } });
        return res.status(200).json({ success: true, data: messages });
    } catch (error) {
        console.error("Error getting all messages:", error);
        return res.status(500).json({ success: false, error: "Failed to fetch messages" });
    }
};

export const postMessage = async (req: Request, res: Response<ApiResponse<Message>>) => {
    try {
        const { text, senderId, chatId } = req.body;
        const newMessage = await prisma.message.create({ data: { text, senderId, chatId } });

        const now = new Date().toISOString();

        await prisma.chat.update({ where: { id: chatId }, data: { updatedAt: now } });

        // Ensure participant exists and update lastReadAt
        const updated = await prisma.chatParticipant.updateMany({
            where: { chatId, userId: senderId },
            data: { lastReadAt: now },
        });

        if (updated.count === 0) {
            await prisma.chatParticipant.create({
                data: { chatId, userId: senderId, lastReadAt: now },
            });
        }

        return res.status(201).json({ success: true, data: newMessage });
    } catch (error) {
        console.error("Error creating message:", error);
        return res.status(500).json({ success: false, error: "Failed to create message" });
    }
};
