import { prisma } from "@/helpers";
import { checkNaN, parseUser } from "@/utils";
import type { Request, Response } from "express";
import type { ApiResponse, TopTrendingUser, User } from "@shared/types";
import type { Prisma } from "@prisma/client";
import { parseWeeklyTopUser } from "@/utils/parsers/parseWeeklyTopUser";

export const getSuggestedUsers = async (
    req: Request<{}, {}, {}, { limit: string }>,
    res: Response<ApiResponse<User[]>>,
) => {
    try {
        const { userId } = req.user ?? {};
        const { limit } = req.query;
        const limitNumber = Number(limit);
        const take = isNaN(limitNumber) ? 4 : limitNumber;

        let whereCondition = {};

        if (userId) {
            const followingIds = await prisma.user.findUnique({
                where: { id: userId },
                select: { following: { select: { followingId: true } } },
            });
            const followingIdsList = followingIds?.following.map((el) => el.followingId) ?? [];

            if (followingIdsList.length >= take) {
                whereCondition = { id: { notIn: [...followingIdsList, userId] } };
            } else {
                whereCondition = { id: { notIn: [userId] } };
            }
        }

        const suggestedUsers = await prisma.user.findMany({
            where: whereCondition,
            take: take,
            include: {
                _count: {
                    select: {
                        followers: true,
                        following: true,
                        likes: true,
                        comments: true,
                        posts: true,
                        bookmarks: true,
                    },
                },
                followers: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return res
            .status(200)
            .json({ success: true, data: suggestedUsers.map((u) => parseUser(u, userId)) });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Failed to fetch suggested users" });
    }
};

export const postFollowUser = async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse<User>>,
) => {
    try {
        const { userId } = req.user!;
        const { id } = req.params;
        const followingId = Number(id);

        if (userId === followingId) {
            return res.status(400).json({ success: false, error: "You cannot follow yourself" });
        }

        const userToFollow = await prisma.user.findUnique({
            where: { id: followingId },
            include: {
                _count: {
                    select: {
                        followers: true,
                        following: true,
                        likes: true,
                        comments: true,
                        posts: true,
                    },
                },
                followers: true,
            },
        });

        if (!userToFollow) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        await prisma.follow.upsert({
            where: { followerId_followingId: { followerId: userId, followingId: followingId } },
            create: { followingId: followingId, followerId: userId },
            update: {},
        });

        const updated = await prisma.user.findUnique({
            where: { id: followingId },
            include: {
                _count: {
                    select: {
                        followers: true,
                        following: true,
                        likes: true,
                        comments: true,
                        posts: true,
                        bookmarks: true,
                    },
                },
                followers: true,
            },
        });

        return res.status(200).json({ success: true, data: parseUser(updated!, userId) });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Failed to follow user" });
    }
};

export const deleteUnfollowUser = async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse<User>>,
) => {
    try {
        const { userId } = req.user!;
        const { id } = req.params;
        const followingId = Number(id);

        if (userId === followingId) {
            return res
                .status(400)
                .json({ success: false, error: "You cannot unsubscribe yourself" });
        }

        const userToUnSubscribe = await prisma.user.findUnique({
            where: { id: followingId },
            include: {
                _count: {
                    select: {
                        followers: true,
                        following: true,
                        likes: true,
                        comments: true,
                        posts: true,
                    },
                },
                followers: true,
            },
        });

        if (!userToUnSubscribe) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        await prisma.follow.deleteMany({ where: { followerId: userId, followingId: followingId } });

        const updated = await prisma.user.findUnique({
            where: { id: followingId },
            include: {
                _count: {
                    select: {
                        followers: true,
                        following: true,
                        likes: true,
                        comments: true,
                        posts: true,
                        bookmarks: true,
                    },
                },
                followers: true,
            },
        });

        return res.status(200).json({ success: true, data: parseUser(updated!, userId) });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Failed to unsubscribe user" });
    }
};

export const getOneUserById = async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse<User>>,
) => {
    try {
        const { userId: currentUserId } = req.user ?? {};
        const { id } = req.params;

        const userId = Number(id);

        const user = await prisma.user.findFirstOrThrow({
            where: { id: userId },
            include: {
                _count: {
                    select: {
                        followers: true,
                        following: true,
                        likes: true,
                        comments: true,
                        posts: true,
                        bookmarks: true,
                    },
                },
                followers: true,
            },
        });

        if (currentUserId) {
            return res
                .status(200)
                .json({ success: true, data: { ...parseUser(user, currentUserId) } });
        }

        return res.status(200).json({ success: true, data: parseUser(user) });
    } catch (error) {
        console.error("Error getting user:", error);
        return res.status(500).json({ success: false, error: "Failed to fetch user" });
    }
};

export const getOneUserByHandle = async (
    req: Request<{ handle: string }>,
    res: Response<ApiResponse<User>>,
) => {
    try {
        const { userId: currentUserId } = req.user ?? {};
        const { handle } = req.params;

        const user = await prisma.user.findFirstOrThrow({
            where: { handle },
            include: {
                _count: {
                    select: {
                        followers: true,
                        following: true,
                        likes: true,
                        comments: true,
                        posts: true,
                        bookmarks: true,
                    },
                },
                followers: true,
            },
        });

        if (currentUserId) {
            return res.status(200).json({ success: true, data: parseUser(user, currentUserId) });
        }

        return res.status(200).json({ success: true, data: parseUser(user) });
    } catch (error) {
        console.error("Error getting user:", error);
        return res.status(500).json({ success: false, error: "Failed to fetch user" });
    }
};

// ... existing imports ...

export const getWeeklyTopUsers = async (
    req: Request<{}, {}, {}, { limit: string; tag?: string }>,
    res: Response<ApiResponse<TopTrendingUser[]>>,
) => {
    try {
        const limit = req.query.limit;
        const tag = req.query?.tag;

        const limitNumber = checkNaN(limit, 5);

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        let strictPostWhereCondition: Prisma.PostWhereInput = { createdAt: { gte: oneWeekAgo } };
        if (tag) {
            strictPostWhereCondition = {
                ...strictPostWhereCondition,
                tags: { some: { tag: { name: tag } } },
            };
        }

        const rawTopUsers = await prisma.user.findMany({
            where: { posts: { some: strictPostWhereCondition } },
            orderBy: { posts: { _count: "desc" } },
            select: {
                id: true,
                username: true,
                avatar: true,
                handle: true,
                _count: { select: { followers: true, posts: { where: strictPostWhereCondition } } },
            },
            take: limitNumber,
        });

        if (rawTopUsers.length < limitNumber) {
            let softPostWhereCondition: Prisma.PostWhereInput = {};
            if (tag) {
                softPostWhereCondition = {
                    ...softPostWhereCondition,
                    tags: { some: { tag: { name: tag } } },
                };
            }

            const rawSoftTopUsers = await prisma.user.findMany({
                where: { posts: { some: softPostWhereCondition } },
                orderBy: { posts: { _count: "desc" } },
                select: {
                    id: true,
                    username: true,
                    avatar: true,
                    handle: true,
                    _count: {
                        select: { followers: true, posts: { where: softPostWhereCondition } },
                    },
                },
                take: limitNumber,
            });

            return res
                .status(200)
                .json({ success: true, data: rawSoftTopUsers.map(parseWeeklyTopUser) });
        }

        return res.status(200).json({ success: true, data: rawTopUsers.map(parseWeeklyTopUser) });
    } catch (error) {
        console.error("Error fetching weekly top users: ", error);
        return res.status(500).json({ success: false, error: "Failed to fetch weekly top users" });
    }
};
