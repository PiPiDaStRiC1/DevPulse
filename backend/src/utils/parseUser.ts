import type { PrismaUser } from "@/types";
import type { User } from "@shared/types";

export const parseUser = (user: PrismaUser, currentUserId?: number): User => {
    let isFollowing = false;

    if (currentUserId) {
        isFollowing = user.followers.some((follow) => follow.followerId === currentUserId);
    }

    return {
        id: user.id,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt,
        email: user.email,
        handle: user.handle,
        isVerified: user.isVerified,
        role: user.role,
        username: user.username,
        followers: user._count.followers,
        following: user._count.following,
        isFollowing,
    };
};
