import { Router } from "express";

const authRouter = Router();

authRouter.post("/login", (_req, res) => {
    // Handle login logic here
    res.json({ success: true, message: "Login successful" });
});

export { authRouter };
