import { prisma } from "@/helpers";
import { Prisma } from "@prisma/client";
import type { Response, Request } from "express";
import type { ApiResponse } from "@shared/types";
import type { Post } from "@shared/types";

export const getPosts = async (_req: Request, res: Response<ApiResponse<unknown>>) => {
    try {
        const posts = await prisma.post.findMany();
        res.status(200).json({ success: true, data: posts });
    } catch (error) {
        res.status(500).json({ success: false, error: "Failed to fetch posts" });
    }
};

export const getOnePost = async (req: Request, res: Response<ApiResponse<unknown>>) => {
    try {
        const { id } = req.params;

        const postId = Number(id);

        const post = await prisma.post.findFirstOrThrow({ where: { id: postId } });
        res.status(200).json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ success: false, error: "Failed to fetch post" });
    }
};

export const postPost = async (
    req: Request<{}, {}, Post, {}>,
    res: Response<ApiResponse<unknown>>,
) => {
    try {
        const { tags, techStack, comments, codeSnippet, ...rest } = req.body;

        const data: Prisma.XOR<Prisma.PostCreateInput, Prisma.PostUncheckedCreateInput> = {
            ...rest,
            tags: { create: tags.map((name) => ({ name })) },
            techStack: { create: techStack.map((name) => ({ name })) },
            comments: { create: comments.map((comment) => ({ ...comment })) },
        };

        if (codeSnippet) {
            data["codeSnippet"] = {
                create: { code: codeSnippet.code, language: codeSnippet.language },
            };
        }

        await prisma.post.create({ data });

        res.status(201).json({ success: true, data: "Post created successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: "Failed to create post" });
    }
};
