import type { Comment } from "./comment";

export interface CodeSnippet {
    language: string | null;
    code: string | null;
}

export interface Post {
    id?: number;
    authorId?: number;
    content: string;
    tags: string[];
    techStack: string[];
    likes?: number;
    comments: Comment[];
    reposts?: number;
    bookmarks?: number;
    createdAt?: Date;
    isLiked?: boolean;
    isBookmarked?: boolean;
    isReposted?: boolean;
    image: string | null;
    codeSnippet: CodeSnippet | null;
}
