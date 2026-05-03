import { Router } from "express";
import { verifyJWT } from "@/helpers";
import { loginUser, registerUser, fetchMe, refreshToken } from "@/services";

const authRouter = Router();

authRouter.get("/refresh", verifyJWT, refreshToken);
authRouter.get("/me", verifyJWT, fetchMe);
authRouter.post("/login", loginUser);
authRouter.post("/register", registerUser);

export { authRouter };
