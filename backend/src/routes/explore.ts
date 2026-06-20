import { Router } from "express";
import { getTopics, getTrending } from "@/services";

const exploreRouter = Router();

exploreRouter.get("/topics", getTopics);
exploreRouter.get("/trending", getTrending);

export { exploreRouter };
