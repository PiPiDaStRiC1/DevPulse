import type { Post } from "@shared/types";
import type { PrismaPost } from "@/types";

function countReadTime(content: string) {
    const wordsCount = content.trim() ? content.trim().split(/\s+/).length : 0;
    const WORDS_PER_MINUTE = 150;

    return Math.max(1, Math.ceil(wordsCount / WORDS_PER_MINUTE));
}

export const parsePost = (post: PrismaPost, currentUserId?: number): Post => {
    let isLiked = false;

    if (currentUserId) {
        isLiked = post.likes.some((like) => like.userId === currentUserId);
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
        bookmarks: post.bookmarks,
        createdAt: post.createdAt,
        isLiked: isLiked,
        isBookmarked: post.isBookmarked,
        isReposted: post.isReposted,
        image: post.image,
        codeSnippet: post.codeSnippet
            ? { language: post.codeSnippet.language, code: post.codeSnippet.code }
            : null,
    };
};
