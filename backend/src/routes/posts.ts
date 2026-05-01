import { Router } from "express";
import { verifyJWT } from "@/helpers";
import { getOnePost, getPosts, postPost } from "@/services";

const postsRouter = Router();

postsRouter.get("/", getPosts);
postsRouter.post("/", verifyJWT, postPost);
postsRouter.get("/:id", getOnePost);

export { postsRouter };
