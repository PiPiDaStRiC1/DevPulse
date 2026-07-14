import type { PrismaWeeklyTopPost } from "@/types";
import type { TopTrendingPost } from "@shared/types";

export const parseWeeklyTopPost = (post: PrismaWeeklyTopPost): TopTrendingPost => {
    return { id: post.id, title: post.title, likes: post._count.likes };
};
