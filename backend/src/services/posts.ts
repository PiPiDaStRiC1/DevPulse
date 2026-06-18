import { prisma } from "@/helpers";
import { Prisma } from "@prisma/client";
import { postCreateSchema } from "@shared/schemas";
import { parsePost, getQueryOptionsForPosts, countReadTime, generateExcerpt } from "@/utils";
import type { Response, Request } from "express";
import type {
    Post,
    ApiResponse,
    PostDTO,
    Comment,
    CommentDTO,
    FeedPostsFilter,
    RelatedPost,
} from "@shared/types";

export const getPosts = async (req: Request, res: Response<ApiResponse<Post[]>>) => {
    try {
        const filter = req.query.filter as FeedPostsFilter;
        const currentUserId = req.user?.userId;

        const posts = await getQueryOptionsForPosts(filter, currentUserId);

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
                codeSnippet: true,
                bookmarks: true,
                _count: { select: { likes: true, comments: true } },
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
            excerpt: generateExcerpt(content),
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
                codeSnippet: true,
                bookmarks: true,
                _count: { select: { likes: true, comments: true } },
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
    res: Response<ApiResponse<string>>,
) => {
    try {
        const { userId } = req.user!;
        const { id } = req.params;

        const postId = Number(id);

        const post = await prisma.post.findUnique({ where: { id: postId } });

        if (!post) {
            return res.status(404).json({ success: false, error: "Post not found" });
        }

        await prisma.like.upsert({
            where: { postId_userId: { postId, userId } },
            create: { postId, userId },
            update: {},
        });

        return res.status(201).json({ success: true, data: "Success" });
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

        const post = await prisma.post.findUnique({ where: { id: postId } });

        if (!post) {
            return res.status(404).json({ success: false, error: "Post not found" });
        }

        await prisma.like.deleteMany({ where: { postId: postId, userId: userId } });

        return res.status(200).json({ success: true, data: "Success" });
    } catch (error) {
        console.error("Error deleting like: ", error);
        return res.status(500).json({ success: false, error: "Failed to delete like" });
    }
};

export const postBookmarkPost = async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse<string>>,
) => {
    try {
        const { userId } = req.user!;
        const { id } = req.params;

        const postId = Number(id);

        const post = await prisma.post.findUnique({ where: { id: postId } });

        if (!post) {
            return res.status(404).json({ success: false, error: "Post not found" });
        }

        await prisma.bookmark.upsert({
            where: { postId_userId: { postId, userId } },
            create: { postId, userId },
            update: {},
        });

        return res.status(201).json({ success: true, data: "Success" });
    } catch (error) {
        console.error("Error creating bookmark: ", error);
        return res.status(500).json({ success: false, error: "Failed to create bookmark" });
    }
};

export const deleteBookmarkPost = async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse<string>>,
) => {
    try {
        const { userId } = req.user!;
        const { id } = req.params;

        const postId = Number(id);

        const post = await prisma.post.findUnique({ where: { id: postId } });

        if (!post) {
            return res.status(404).json({ success: false, error: "Post not found" });
        }

        await prisma.bookmark.deleteMany({ where: { postId: postId, userId: userId } });

        return res.status(200).json({ success: true, data: "Success" });
    } catch (error) {
        console.error("Error deleting bookmark: ", error);
        return res.status(500).json({ success: false, error: "Failed to delete bookmark" });
    }
};

export const getComments = async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse<Comment[]>>,
) => {
    try {
        const { id } = req.params;

        const postId = Number(id);

        const comments = await prisma.postComment.findMany({
            where: { postId },
            orderBy: { createdAt: "desc" },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        handle: true,
                        avatar: true,
                        isVerified: true,
                    },
                },
            },
        });

        return res.status(200).json({ success: true, data: comments });
    } catch (error) {
        console.error("Error fetching comments: ", error);
        return res.status(500).json({ success: false, error: "Failed to fetch comments" });
    }
};

export const postComment = async (
    req: Request<{}, {}, CommentDTO>,
    res: Response<ApiResponse<Comment>>,
) => {
    try {
        const { userId } = req.user!;

        const { postId, text } = req.body;

        const comment = await prisma.postComment.create({
            data: { text, authorId: userId, postId },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        handle: true,
                        avatar: true,
                        isVerified: true,
                    },
                },
            },
        });

        return res.status(201).json({ success: true, data: comment });
    } catch (error) {
        console.error("Error creating comment: ", error);
        return res.status(500).json({ success: false, error: "Failed to create comment" });
    }
};

export const getRelatedPosts = async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse<RelatedPost[]>>,
) => {
    try {
        const { id } = req.params;
        const currentUserId = req.user?.userId;

        const postId = Number(id);

        const currentPost = await prisma.post.findUnique({
            where: { id: postId },
            include: { tags: true },
        });

        if (!currentPost) {
            return res.status(404).json({ success: false, error: "Current post not found" });
        }

        let whereCondition = {
            id: { not: postId },
            tags: { some: { name: { in: currentPost.tags.map((tag) => tag.name) } } },
        } as Prisma.PostWhereInput;

        if (currentUserId) {
            const followingIds = await prisma.user.findUnique({
                where: { id: currentUserId },
                select: { following: { select: { followingId: true } } },
            });
            const followingIdsList = followingIds?.following.map((el) => el.followingId) ?? [];

            whereCondition = {
                ...whereCondition,
                authorId: { in: followingIdsList, notIn: [currentUserId] },
            };
        }

        const candidateRelatedPosts = await prisma.post.findMany({
            where: whereCondition,
            take: 5,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                title: true,
                content: true,
                _count: { select: { likes: true } },
                author: { select: { username: true, handle: true, avatar: true } },
            },
        });

        const fallbackRelatedPosts = await prisma.post.findMany({
            where: { id: { not: postId } },
            take: 5 - candidateRelatedPosts.length,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                title: true,
                content: true,
                _count: { select: { likes: true } },
                author: { select: { username: true, handle: true, avatar: true } },
            },
        });

        const parsedRelatedPosts: RelatedPost[] = [
            ...candidateRelatedPosts,
            ...fallbackRelatedPosts,
        ].map((post) => ({
            id: post.id,
            title: post.title,
            author: post.author,
            likes: post._count.likes,
            readTime: countReadTime(post.content),
        }));

        return res.status(200).json({ success: true, data: parsedRelatedPosts });
    } catch (error) {
        console.error("Error fetching related posts: ", error);
        return res.status(500).json({ success: false, error: "Failed to fetch related posts" });
    }
};