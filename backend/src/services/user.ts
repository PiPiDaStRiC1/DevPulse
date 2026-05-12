import { prisma } from "@/helpers";
import { parseUser } from "@/utils";
import type { Request, Response } from "express";
import type { ApiResponse, User } from "@shared/types";

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

            whereCondition = { id: { notIn: [userId] } };
            // whereCondition = { id: { notIn: [...followingIdsList, userId] } };
        }

        const suggestedUsers = await prisma.user.findMany({
            where: whereCondition,
            take: take,
            include: { _count: { select: { followers: true, following: true } }, followers: true },
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
            include: { _count: { select: { followers: true, following: true } }, followers: true },
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
            include: { _count: { select: { followers: true, following: true } }, followers: true },
        });

        console.log(updated);
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
            include: { _count: { select: { followers: true, following: true } }, followers: true },
        });

        if (!userToUnSubscribe) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        await prisma.follow.delete({
            where: { followerId_followingId: { followerId: userId, followingId: followingId } },
        });

        const updated = await prisma.user.findUnique({
            where: { id: followingId },
            include: { _count: { select: { followers: true, following: true } }, followers: true },
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
            include: { _count: { select: { followers: true, following: true } }, followers: true },
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
            include: { _count: { select: { followers: true, following: true } }, followers: true },
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
