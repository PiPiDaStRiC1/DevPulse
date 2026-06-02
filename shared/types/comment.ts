export interface CommentAuthor {
    id: number;
    username: string;
    handle: string;
    avatar: string | null;
    isVerified: boolean;
}

export interface Comment {
    id: number;
    postId: number;
    authorId: number;
    text: string;
    createdAt: Date;
    author?: CommentAuthor;
}

export type CommentDTO = Omit<Comment, "id" | "createdAt" | "authorId" | "author">;
