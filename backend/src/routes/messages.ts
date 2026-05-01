import { Router } from "express";
import { getMessages, postMessage } from "@/services";
import { verifyJWT } from "@/helpers";

const messagesRouter = Router();

messagesRouter.post("/chat", verifyJWT, postMessage);
messagesRouter.get("/chat/:id", verifyJWT, getMessages);

export { messagesRouter };
