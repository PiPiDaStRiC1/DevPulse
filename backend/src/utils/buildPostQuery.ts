import { Prisma } from "@prisma/client";
import type { FeedPostsFilter } from "@shared/types";

export const buildPostsQuery = (
    filter: FeedPostsFilter | undefined,
    currentUserId?: number,
): Prisma.PostFindManyArgs => {
    const query: Prisma.PostFindManyArgs = {
        include: {
            tags: { select: { tag: { select: { name: true } } } },
            techStack: true,
            codeSnippet: true,
            bookmarks: true,
            _count: { select: { likes: true, comments: true, bookmarks: true } },
            likes: true,
        },
        orderBy: { createdAt: "desc" },
    };

    switch (filter) {
        case "following":
            if (currentUserId) {
                query.where = { author: { followers: { some: { followerId: currentUserId } } } };
            }
            break;

        case "trending":
            query.orderBy = [{ likes: { _count: "desc" } }, { createdAt: "desc" }];
            break;

        case "for-you":
        default:
            break;
    }

    return query;
};
