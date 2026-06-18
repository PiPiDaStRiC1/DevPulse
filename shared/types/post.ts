import type { Comment } from "./comment";
import type { User } from "./user";

export interface CodeSnippet {
    language: string | null;
    code: string | null;
}

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
    createdAt: Date;
    isLiked: boolean;
    isBookmarked: boolean;
    isReposted?: boolean;
    image: string | null;
    codeSnippet: CodeSnippet | null;
}

export interface RelatedPost {
    id: number;
    title: string;
    author: Pick<User, "username" | "avatar" | "handle">;
    likes: number;
    readTime: number;
}

export type PostDTO = Omit<Post, "id" | "readTime" | "comments" | "createdAt"> & {
    comments: Comment[];
};
