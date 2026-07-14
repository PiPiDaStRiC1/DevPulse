import { Router } from "express";
import {
    getOneUserById,
    getOneUserByHandle,
    getSuggestedUsers,
    postFollowUser,
    deleteUnfollowUser,
    getWeeklyTopUsers,
} from "@/services";
import { optionalAuth, verifyJWT } from "@/middleware";

const userRouter = Router();

userRouter.get("/suggested", optionalAuth, getSuggestedUsers);
userRouter.get("/weekly-top", getWeeklyTopUsers);
userRouter.post("/:id/follow", verifyJWT, postFollowUser);
userRouter.delete("/:id/follow", verifyJWT, deleteUnfollowUser);
userRouter.get("/id/:id", optionalAuth, getOneUserById);
userRouter.get("/handle/:handle", optionalAuth, getOneUserByHandle);

export { userRouter };
