import { Router } from "express";
import { getChats, postChat } from "@/services";

const chatRouter = Router();

chatRouter.get("/", getChats).post("/", postChat);

export { chatRouter };
