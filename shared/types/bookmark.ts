import type { User } from "./user";

export interface Bookmark {
    id: number;
    postId: number;
    postTitle: string;
    postExcerpt: string;
    tags: string[];
    author: Pick<User, "username" | "avatar" | "handle">;
    createdAt: Date;
}
