import { prisma } from "@/helpers";
import { Prisma } from "@prisma/client";
import type { Response, Request } from "express";
import type { ApiResponse } from "@shared/types";
import type { Post } from "@shared/types";
import { postCreateSchema } from "@shared/schemas";

const parsedPost = (post: any): Post => ({
    id: post.id,
    authorId: post.authorId,
    content: post.content,
    tags: post.tags.map((t: any) => t.name),
    techStack: post.techStack.map((t: any) => t.name),
    likes: post.likes,
    comments: post.comments,
    reposts: post.reposts,
    bookmarks: post.bookmarks,
    createdAt: post.createdAt,
    isLiked: post.isLiked,
    isBookmarked: post.isBookmarked,
    isReposted: post.isReposted,
    image: post.image,
    codeSnippet: post.codeSnippet
        ? { language: post.codeSnippet.language, code: post.codeSnippet.code }
        : null,
});

export const getPosts = async (_req: Request, res: Response<ApiResponse<Post[]>>) => {
    try {
        const posts = await prisma.post.findMany({
            include: { tags: true, techStack: true, comments: true, codeSnippet: true },
        });
        return res.status(200).json({ success: true, data: posts.map(parsedPost) });
    } catch (error) {
        console.error("Error getting all posts:", error);
        return res.status(500).json({ success: false, error: "Failed to fetch posts" });
    }
};

export const getOnePost = async (req: Request, res: Response<ApiResponse<Post>>) => {
    try {
        const { id } = req.params;

        const postId = Number(id);

        const post = await prisma.post.findFirstOrThrow({
            where: { id: postId },
            include: { tags: true, techStack: true, comments: true, codeSnippet: true },
        });
        return res.status(200).json({ success: true, data: parsedPost(post) });
    } catch (error) {
        console.error("Error getting post:", error);
        return res.status(500).json({ success: false, error: "Failed to fetch post" });
    }
};

export const postPost = async (
    req: Request<{}, {}, Omit<Post, "id">, {}>,
    res: Response<ApiResponse<Post>>,
) => {
    try {
        const parsed = postCreateSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({ success: false, error: "Invalid post data" });
        }

        const { tags, techStack, comments, codeSnippet, image, content } = parsed.data;
        const { userId } = req.user!;

        const data: Prisma.PostCreateInput = {
            content,
            image: image === undefined ? null : image,
            author: { connect: { id: userId } },
            tags: { create: tags.map((name) => ({ name })) },
            techStack: { create: techStack.map((name) => ({ name })) },
            comments: { create: comments.map((comment) => ({ ...comment })) },
        };

        console.log("Received post data:", data);
        if (codeSnippet && codeSnippet !== null) {
            data["codeSnippet"] = {
                create: { code: codeSnippet.code ?? null, language: codeSnippet.language ?? null },
            };
        }

        const post = await prisma.post.create({
            data,
            include: { tags: true, techStack: true, comments: true, codeSnippet: true },
        });

        return res.status(201).json({ success: true, data: parsedPost(post) });
    } catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).json({ success: false, error: "Failed to create post" });
    }
};
