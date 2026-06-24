import { Router } from "express";
import { getTopics, getTrendingPosts, getOneTopicBySlug } from "@/services";

const exploreRouter = Router();

exploreRouter.get("/topics", getTopics);
exploreRouter.get("/topics/:slug", getOneTopicBySlug);
exploreRouter.get("/trending", getTrendingPosts);

export { exploreRouter };
