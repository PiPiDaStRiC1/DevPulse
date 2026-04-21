import { Router } from "express";
import { verifyJWT } from "@/helpers";
import { loginUser, registerUser, fetchMe, refreshToken } from "@/services";

const authRouter = Router();

authRouter
    .get("/refresh", verifyJWT, refreshToken)
    .get("/me", verifyJWT, fetchMe)
    .post("/login", loginUser)
    .post("/register", registerUser);

export { authRouter };
