import { prisma } from "@/helpers";
import type { FeedPostsFilter } from "@shared/types";

export const getQueryOptionsForPosts = async (
    filter: FeedPostsFilter | undefined,
    currentUserId: number | undefined,
) => {
    const baseInclude = {
        tags: true,
        techStack: true,
        codeSnippet: true,
        bookmarks: true,
        _count: { select: { likes: true, comments: true } },
        likes: true,
    };

    switch (filter) {
        case "for-you":
            return await prisma.post.findMany({
                include: baseInclude,
                orderBy: { createdAt: "desc" },
            });
        case "following":
            if (!currentUserId) {
                return await prisma.post.findMany({
                    include: baseInclude,
                    orderBy: { createdAt: "desc" },
                });
            }
            return await prisma.post.findMany({
                include: baseInclude,
                where: { author: { followers: { some: { followerId: currentUserId } } } },
                orderBy: { createdAt: "desc" },
            });
        case "trending":
            return await prisma.post.findMany({
                include: baseInclude,
                orderBy: [{ likes: { _count: "desc" } }, { createdAt: "desc" }],
            });
        default:
            return await prisma.post.findMany({
                include: baseInclude,
                orderBy: { createdAt: "desc" },
            });
    }
};
