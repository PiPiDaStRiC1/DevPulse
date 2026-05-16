import { verifyToken } from "@/helpers";
import type { Response, Request, NextFunction } from "express";
import type { ApiResponse } from "@shared/types";

export const verifyJWT = (req: Request, res: Response<ApiResponse<string>>, next: NextFunction) => {
    try {
        const token = req.headers["authorization"]?.split(" ")?.[1];

        const payload = verifyToken(token);

        req.user = payload;

        return next();
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ success: false, error: error.message });
        }
    }
};
