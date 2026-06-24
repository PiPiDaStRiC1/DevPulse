import { Router } from "express";
import { getTopics, getTrendingPosts } from "@/services";

const exploreRouter = Router();

exploreRouter.get("/topics", getTopics);
exploreRouter.get("/trending", getTrendingPosts);

export { exploreRouter };
