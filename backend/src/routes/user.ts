import { Router } from "express";
import { getOneUser } from "@/services";

const userRouter = Router();

userRouter.get("/:id", getOneUser);

export { userRouter };
