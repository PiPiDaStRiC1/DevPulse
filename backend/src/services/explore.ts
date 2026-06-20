import { prisma } from "@/helpers";
import { parseTopicTag } from "@/utils";
import type { Response, Request } from "express";
import type { ApiResponse } from "@shared/types";
import type { TopicTag } from "@shared/types";

export const getTopics = async (_req: Request, res: Response<ApiResponse<TopicTag[]>>) => {
    try {
        const topics = await prisma.tag.findMany({
            orderBy: { createdAt: "desc" },
            include: { _count: { select: { tags: true } } },
        });

        return res.status(200).json({ success: true, data: topics.map(parseTopicTag) });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Failed to fetch topics" });
    }
};

export const getTrending = async (_req: Request, res: Response<ApiResponse<TopicTag[]>>) => {
    try {
        const trending = await prisma.tag.findMany({
            orderBy: { tags: { _count: "desc" } },
            include: { _count: { select: { tags: true } } },
            take: 10,
        });

        return res.status(200).json({ success: true, data: trending.map(parseTopicTag) });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Failed to fetch trending topics" });
    }
};
