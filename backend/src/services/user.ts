import { prisma } from "@/helpers";
import { parseUser } from "@/utils";
import type { Request, Response } from "express";
import type { ApiResponse, User } from "@shared/types";

export const getSuggestedUsers = async (
    req: Request<{ limit: string }>,
    res: Response<ApiResponse<User[]>>,
) => {
    try {
        const { userId } = req.user ?? {};
        const { limit } = req.params;
        const limitNumber = Number(limit);
        const take = isNaN(limitNumber) ? 4 : limitNumber;

        let whereCondition = {};

        if (userId) {
            const followingIds = await prisma.user.findUnique({
                where: { id: userId },
                select: { following: { select: { followingId: true } } },
            });
            const followingIdsList = followingIds?.following.map((el) => el.followingId) ?? [];

            whereCondition = { id: { notIn: [...followingIdsList, userId] } };
        }

        const suggestedUsers = await prisma.user.findMany({
            where: whereCondition,
            take: take,
            include: { _count: { select: { followers: true, following: true } } },
            orderBy: { createdAt: "desc" },
        });

        return res.status(200).json({ success: true, data: suggestedUsers.map(parseUser) });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Failed to fetch suggested users" });
    }
};

export const getOneUserById = async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse<User>>,
) => {
    try {
        const { id } = req.params;

        const userId = Number(id);

        const user = await prisma.user.findFirstOrThrow({
            where: { id: userId },
            include: { _count: { select: { followers: true, following: true } } },
        });

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
        const { handle } = req.params;

        const user = await prisma.user.findFirstOrThrow({
            where: { handle },
            include: { _count: { select: { followers: true, following: true } } },
        });

        return res.status(200).json({ success: true, data: parseUser(user) });
    } catch (error) {
        console.error("Error getting user:", error);
        return res.status(500).json({ success: false, error: "Failed to fetch user" });
    }
};
