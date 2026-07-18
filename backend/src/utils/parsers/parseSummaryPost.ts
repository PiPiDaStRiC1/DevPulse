import type { PrismaSummaryPost } from "@/types";
import type { SummaryPost } from "@shared/types";

export const parseSummaryPost = (post: PrismaSummaryPost): SummaryPost => {
    return {
        id: post.id,
        title: post.title,
        author: {
            avatar: post.author.avatar,
            handle: post.author.handle,
            username: post.author.username,
        },
        bookmarks: post._count.bookmarks,
        comments: post._count.comments,
        createdAt: post.createdAt,
        likes: post._count.likes,
    };
};
