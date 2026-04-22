import { Router } from "express";
import { verifyJWT } from "@/helpers";
import { getOnePost, getPosts, postPost } from "@/services";

const postsRouter = Router();

postsRouter.get("/", getPosts).post("/", verifyJWT, postPost).get("/:id", getOnePost);

export { postsRouter };
