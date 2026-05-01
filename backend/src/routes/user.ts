import { Router } from "express";
import { getOneUserById, getOneUserByHandle } from "@/services";

const userRouter = Router();

userRouter.get("/id/:id", getOneUserById);
userRouter.get("/handle/:handle", getOneUserByHandle);

export { userRouter };
