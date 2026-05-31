import { prisma } from "@/helpers";
import { Prisma } from "@prisma/client";
import { postCreateSchema } from "@shared/schemas";
import { parsePost } from "@/utils";
import type { Response, Request } from "express";
import type { Post, ApiResponse, PostDTO, Like } from "@shared/types";

export const getPosts = async (req: Request, res: Response<ApiResponse<Post[]>>) => {
    try {
        const currentUserId = req.user?.userId;

        const posts = await prisma.post.findMany({
            include: {
                tags: true,
                techStack: true,
                comments: true,
                codeSnippet: true,
                _count: { select: { likes: true } },
                likes: true,
            },
            orderBy: { createdAt: "desc" },
        });
        return res
            .status(200)
            .json({ success: true, data: posts.map((post) => parsePost(post, currentUserId)) });
    } catch (error) {
        console.error("Error getting all posts: ", error);
        return res.status(500).json({ success: false, error: "Failed to fetch posts" });
    }
};

export const getOnePost = async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse<Post>>,
) => {
    try {
        const { id } = req.params;
        const currentUserId = req.user?.userId;

        const postId = Number(id);

        const post = await prisma.post.findFirstOrThrow({
            where: { id: postId },
            include: {
                tags: true,
                techStack: true,
                comments: true,
                codeSnippet: true,
                _count: { select: { likes: true } },
                likes: true,
            },
        });
        return res.status(200).json({ success: true, data: parsePost(post, currentUserId) });
    } catch (error) {
        console.error("Error getting post: ", error);
        return res.status(500).json({ success: false, error: "Failed to fetch post" });
    }
};

export const postPost = async (
    req: Request<{}, {}, PostDTO, {}>,
    res: Response<ApiResponse<Post>>,
) => {
    try {
        const parsed = postCreateSchema.safeParse(req.body);

        if (!parsed.success) {
            const parsedError = JSON.parse(parsed.error.message)[0];
            console.error("Invalid post data: ", parsedError.message);
            return res.status(400).json({ success: false, error: parsedError.message });
        }

        const { tags, techStack, comments, codeSnippet, image, content, title, coverImage } =
            parsed.data;
        const { userId } = req.user!;

        const data: Prisma.PostCreateInput = {
            content,
            title,
            coverImage,
            image: image === undefined ? null : image,
            author: { connect: { id: userId } },
            tags: { create: tags.map((name: string) => ({ name })) },
            techStack: { create: techStack.map((name: string) => ({ name })) },
            comments: { create: comments.map((comment) => ({ ...comment })) },
        };

        if (codeSnippet && codeSnippet !== null) {
            data["codeSnippet"] = {
                create: { code: codeSnippet.code ?? null, language: codeSnippet.language ?? null },
            };
        }

        const post = await prisma.post.create({
            data,
            include: {
                tags: true,
                techStack: true,
                comments: true,
                codeSnippet: true,
                _count: { select: { likes: true } },
                likes: true,
            },
        });

        return res.status(201).json({ success: true, data: parsePost(post, userId) });
    } catch (error) {
        console.error("Error creating post: ", error);
        return res.status(500).json({ success: false, error: "Failed to create post" });
    }
};

export const postLikePost = async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse<Like>>,
) => {
    try {
        const { userId } = req.user!;
        const { id } = req.params;

        const postId = Number(id);

        const like = await prisma.like.upsert({
            where: { postId_userId: { postId, userId } },
            create: { postId, userId },
            update: {},
        });

        return res.status(201).json({ success: true, data: like });
    } catch (error) {
        console.error("Error creating like: ", error);
        return res.status(500).json({ success: false, error: "Failed to create like" });
    }
};

export const deleteDislikePost = async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse<string>>,
) => {
    try {
        const { userId } = req.user!;
        const { id } = req.params;

        const postId = Number(id);

        await prisma.like.delete({ where: { postId_userId: { postId: postId, userId: userId } } });

        return res.status(200).json({ success: true, data: "Success" });
    } catch (error) {
        console.error("Error deleting like: ", error);
        return res.status(500).json({ success: false, error: "Failed to delete like" });
    }
};
