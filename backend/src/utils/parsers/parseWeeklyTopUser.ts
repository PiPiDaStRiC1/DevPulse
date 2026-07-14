import type { PrismaWeeklyTopUser } from "@/types";
import type { TopTrendingUser } from "@shared/types";

export const parseWeeklyTopUser = (user: PrismaWeeklyTopUser): TopTrendingUser => {
    return {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        handle: user.handle,
        followers: user._count.followers,
        posts: user._count.posts,
    };
};
