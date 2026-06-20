import { prisma } from "@/helpers";
import { parseBookmark } from "@/utils";
import type { Response, Request } from "express";
import type { ApiResponse, Bookmark } from "@shared/types";

export const getBookmarks = async (req: Request, res: Response<ApiResponse<Bookmark[]>>) => {
    try {
        const { userId } = req.user!;

        const bookmarks = await prisma.bookmark.findMany({
            where: { userId: userId },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                createdAt: true,
                post: {
                    select: {
                        id: true,
                        title: true,
                        excerpt: true,
                        author: { select: { username: true, avatar: true, handle: true } },
                        tags: { select: { tag: { select: { name: true } } } },
                    },
                },
            },
        });

        return res.status(200).json({ success: true, data: bookmarks.map(parseBookmark) });
    } catch (error) {
        console.error("Error getting all bookmarks: ", error);
        return res.status(500).json({ success: false, error: "Failed to fetch bookmarks" });
    }
};
