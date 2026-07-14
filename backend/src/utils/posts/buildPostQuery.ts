import { Prisma } from "@prisma/client";
import type { FeedPostsFilter, FeedPostsSort } from "@shared/types";

export const buildPostsQuery = (
    filter: FeedPostsFilter,
    sort: FeedPostsSort | undefined,
    tag: string | undefined,
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

    if (tag) {
        query.where = { tags: { some: { tag: { name: tag } } } };
    }

    switch (sort) {
        case "newest":
            query.orderBy = { createdAt: "desc" };
            break;
        case "oldest":
            query.orderBy = { createdAt: "asc" };
            break;
        case "trending":
            query.orderBy = [{ likes: { _count: "desc" } }];
            break;
    }

    switch (filter) {
        case "following":
            if (currentUserId) {
                query.where = {
                    ...query.where,
                    author: { followers: { some: { followerId: currentUserId } } },
                };
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
