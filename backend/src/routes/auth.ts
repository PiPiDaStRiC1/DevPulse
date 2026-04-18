import { Router } from "express";
import { loginUser, registerUser } from "@/services";

const authRouter = Router();

authRouter.post("/login", loginUser).post("/register", registerUser);

export { authRouter };
