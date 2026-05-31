import { Router } from "express";
import { optionalAuth, verifyJWT } from "@/middleware";
import { getOnePost, getPosts, postPost, postLikePost, deleteDislikePost } from "@/services";

const postsRouter = Router();

postsRouter.get("/", optionalAuth, getPosts);
postsRouter.post("/", verifyJWT, postPost);
postsRouter.get("/:id", optionalAuth, getOnePost);
postsRouter.post("/:id/like", verifyJWT, postLikePost);
postsRouter.delete("/:id/like", verifyJWT, deleteDislikePost);

export { postsRouter };
