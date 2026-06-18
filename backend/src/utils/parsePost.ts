import { countReadTime } from "./countReadTime";
import type { Post } from "@shared/types";
import type { PrismaPost } from "@/types";

export const parsePost = (post: PrismaPost, currentUserId?: number): Post => {
    let isLiked = false;
    let isBookmarked = false;

    if (currentUserId) {
        isLiked = post.likes.some((like) => like.userId === currentUserId);
        isBookmarked = post.bookmarks.some((bookmark) => bookmark.userId === currentUserId);
    }

    return {
        id: post.id,
        title: post.title,
        coverImage: post.coverImage,
        readTime: countReadTime(post.content),
        authorId: post.authorId,
        content: post.content,
        tags: post.tags.map((t: any) => t.name),
        techStack: post.techStack.map((t: any) => t.name),
        likes: post._count.likes,
        comments: post._count.comments,
        reposts: post.reposts,
        createdAt: post.createdAt,
        isLiked: isLiked,
        isBookmarked: isBookmarked,
        isReposted: post.isReposted,
        image: post.image,
        codeSnippet: post.codeSnippet
            ? { language: post.codeSnippet.language, code: post.codeSnippet.code }
            : null,
    };
};
