import { prisma } from "@/helpers";
import { parseTopicTag, parseTrendingPost, calculateTrendingScore } from "@/utils";
import type { Response, Request } from "express";
import type { ApiResponse, TrendingPost } from "@shared/types";
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

export const getOneTopicBySlug = async (
    req: Request<{ slug: string }>,
    res: Response<ApiResponse<TopicTag>>,
) => {
    try {
        const { slug } = req.params;

        const topic = await prisma.tag.findFirst({
            where: { slug: slug },
            include: { _count: { select: { tags: true } } },
        });

        if (!topic) {
            return res.status(404).json({ success: false, error: "Not found" });
        }

        return res.status(200).json({ success: true, data: parseTopicTag(topic) });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Failed to fetch topics" });
    }
};

export const getTrendingPosts = async (
    req: Request<{}, {}, {}, { limit: string }>,
    res: Response<ApiResponse<TrendingPost[]>>,
) => {
    try {
        const { limit } = req.query;
        const limitNumber = Number(limit);
        const take = isNaN(limitNumber) ? 5 : limitNumber;

        const trendingPosts = await prisma.post.findMany({
            select: {
                id: true,
                title: true,
                createdAt: true,
                author: { select: { username: true, avatar: true, handle: true } },
                _count: { select: { likes: true, bookmarks: true, comments: true } },
            },
        });

        const parsedTrendingPosts = trendingPosts.map(parseTrendingPost);

        const sortedAndSlicedTrendingPosts = parsedTrendingPosts
            .sort((a, b) => {
                const scoreA = calculateTrendingScore(
                    a.likes,
                    a.comments,
                    a.bookmarks,
                    a.createdAt,
                );
                const scoreB = calculateTrendingScore(
                    b.likes,
                    b.comments,
                    b.bookmarks,
                    b.createdAt,
                );
                return scoreB - scoreA;
            })
            .slice(0, take);

        return res.status(200).json({ success: true, data: sortedAndSlicedTrendingPosts });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Failed to fetch trending posts" });
    }
};
