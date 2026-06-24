import type { PrismaTrendingPost } from "@/types";
import type { TrendingPost } from "@shared/types";

export const parseTrendingPost = (post: PrismaTrendingPost): TrendingPost => {
    return {
        id: post.id,
        title: post.title,
        likes: post._count.likes,
        bookmarks: post._count.bookmarks,
        comments: post._count.comments,
        author: {
            username: post.author.username,
            avatar: post.author.avatar,
            handle: post.author.handle,
        },
        createdAt: post.createdAt,
    };
};
