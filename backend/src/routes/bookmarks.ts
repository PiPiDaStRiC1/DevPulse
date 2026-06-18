import { Router } from "express";
import { getBookmarks } from "@/services";
import { verifyJWT } from "@/middleware";

const bookmarksRouter = Router();

bookmarksRouter.get("/", verifyJWT, getBookmarks);

export { bookmarksRouter };
