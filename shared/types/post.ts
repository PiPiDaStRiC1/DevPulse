import type { Comment } from "./comment";

export interface CodeSnippet {
    language: string;
    code: string;
}

export interface Post {
    id: number;
    authorId: number;
    content: string;
    tags: string[];
    techStack: string[];
    likes: number;
    comments: Comment[];
    reposts: number;
    bookmarks: number;
    createdAt: Date;
    isLiked: boolean;
    isBookmarked: boolean;
    isReposted: boolean;
    image?: string;
    codeSnippet?: CodeSnippet;
}
