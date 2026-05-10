import { Router } from "express";
import { getOneUserById, getOneUserByHandle, getSuggestedUsers } from "@/services";
import { optionalAuth } from "@/helpers";

const userRouter = Router();

userRouter.get("/id/:id", getOneUserById);
userRouter.get("/handle/:handle", getOneUserByHandle);
userRouter.get("/suggested", optionalAuth, getSuggestedUsers);

export { userRouter };
