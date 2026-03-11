export interface Comment {
    id: number;
    postId: number;
    authorId: number;
    text: string;
    createdAt: Date;
}
