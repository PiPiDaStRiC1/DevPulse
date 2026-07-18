import { Router } from "express";
import { optionalAuth, verifyJWT } from "@/middleware";
import {
    getOnePost,
    getPosts,
    postPost,
    postLikePost,
    deleteDislikePost,
    getComments,
    postComment,
    postBookmarkPost,
    deleteBookmarkPost,
    getRelatedPosts,
    getWeeklyTopPosts,
    getSummaryPosts,
} from "@/services";

const postsRouter = Router();

postsRouter.get("/", optionalAuth, getPosts);
postsRouter.post("/", verifyJWT, postPost);
postsRouter.get("/summary", getSummaryPosts);
postsRouter.get("/weekly-top", getWeeklyTopPosts);
postsRouter.get("/:id", optionalAuth, getOnePost);
postsRouter.post("/:id/like", verifyJWT, postLikePost);
postsRouter.delete("/:id/like", verifyJWT, deleteDislikePost);
postsRouter.post("/:id/bookmark", verifyJWT, postBookmarkPost);
postsRouter.delete("/:id/bookmark", verifyJWT, deleteBookmarkPost);
postsRouter.get("/:id/comments", getComments);
postsRouter.post("/:id/comments", verifyJWT, postComment);
postsRouter.get("/:id/related", optionalAuth, getRelatedPosts);


export { postsRouter };
