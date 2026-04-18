import { Router } from "express";

const authRouter = Router();

authRouter.post("/login", (_req, res) => {
    res.json({ success: true, message: "Login successful" });
});

export { authRouter };
