import { Router } from "express";
import { verifyJWT } from "@/helpers";
import { loginUser, registerUser, fetchMe } from "@/services";

const authRouter = Router();

authRouter.get("/me", verifyJWT, fetchMe).post("/login", loginUser).post("/register", registerUser);

export { authRouter };
