import { Router } from "express";
import {
    getOneUserById,
    getOneUserByHandle,
    getSuggestedUsers,
    postFollowUser,
    deleteUnfollowUser,
} from "@/services";
import { optionalAuth, verifyJWT } from "@/middleware";

const userRouter = Router();

userRouter.post("/:id/follow", verifyJWT, postFollowUser);
userRouter.delete("/:id/follow", verifyJWT, deleteUnfollowUser);
userRouter.get("/id/:id", optionalAuth, getOneUserById);
userRouter.get("/handle/:handle", optionalAuth, getOneUserByHandle);
userRouter.get("/suggested", optionalAuth, getSuggestedUsers);

export { userRouter };
