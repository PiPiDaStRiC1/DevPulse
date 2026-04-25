import { prisma } from "@/helpers";
import type { Request, Response } from "express";
import type { ApiResponse, User } from "@shared/types";

export const getOneUser = async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse<User>>,
) => {
    try {
        const { id } = req.params;

        const userId = Number(id);

        const user = await prisma.user.findFirstOrThrow({ where: { id: userId } });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error("Error getting post:", error);
        res.status(500).json({ success: false, error: "Failed to fetch post" });
    }
};
