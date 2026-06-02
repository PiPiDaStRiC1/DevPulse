import type { Comment } from "./comment";

export interface CodeSnippet {
    language: string | null;
    code: string | null;
}

export interface Like {
    id: number;
    postId: number;
    userId: number;
}

export type LikeDTO = Omit<Like, "id" | "userId">;

export interface Post {
    id: number;
    title: string;
    coverImage: string | null;
    readTime: number;
    authorId?: number;
    content: string;
    tags: string[];
    techStack: string[];
    likes: number;
    comments: number;
    reposts?: number;
    bookmarks?: number;
    createdAt?: Date;
    isLiked: boolean;
    isBookmarked?: boolean;
    isReposted?: boolean;
    image: string | null;
    codeSnippet: CodeSnippet | null;
}

export type PostDTO = Omit<Post, "id" | "readTime" | "comments"> & { comments: Comment[] };
