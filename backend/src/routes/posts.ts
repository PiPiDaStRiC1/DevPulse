import { Router } from "express";
import { getOnePost, getPosts, postPost } from "@/services";

const postsRouter = Router();

postsRouter.get("/", getPosts).post("/", postPost).get("/:id", getOnePost);

export { postsRouter };
