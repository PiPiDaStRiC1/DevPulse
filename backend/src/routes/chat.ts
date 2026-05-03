import { Router } from "express";
import { verifyJWT } from "@/helpers";
import { getChats, postChat, getOneChat, patchChat } from "@/services";

const chatRouter = Router();

chatRouter.get("/", verifyJWT, getChats);
chatRouter.post("/", verifyJWT, postChat);
chatRouter.get("/:id", verifyJWT, getOneChat);
chatRouter.patch("/:id", verifyJWT, patchChat);

export { chatRouter };
