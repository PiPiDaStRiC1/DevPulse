import type { PrismaBookmark } from "@/types";
import type { Bookmark } from "@shared/types";

export const parseBookmark = (bookmark: PrismaBookmark): Bookmark => {
    return {
        id: bookmark.id,
        postId: bookmark.post.id,
        postTitle: bookmark.post.title,
        postExcerpt: bookmark.post.excerpt,
        author: {
            username: bookmark.post.author.username,
            avatar: bookmark.post.author.avatar,
            handle: bookmark.post.author.handle,
        },
        tags: bookmark.post.tags.map((tag) => tag.tag.name),
        createdAt: bookmark.createdAt,
    };
};
