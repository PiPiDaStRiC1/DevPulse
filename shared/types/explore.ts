import type { User } from "./user";

export interface TopicTag {
    id: number;
    name: string;
    slug: string;
    postsCount: number;
    createdAt: Date;
}

export interface TrendingPost {
    id: number;
    title: string;
    likes: number;
    bookmarks: number;
    comments: number;
    author: Pick<User, "username" | "avatar" | "handle">;
    createdAt: Date;
}
