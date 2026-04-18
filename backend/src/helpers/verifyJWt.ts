import jwt from "jsonwebtoken";
import type { Response, Request, NextFunction } from "express";
import type { ApiResponse, JWTPayload } from "@shared/types";

export const verifyJWT = (req: Request, res: Response<ApiResponse<string>>, next: NextFunction) => {
    try {
        const token = req.headers["authorization"]?.split(" ")?.[1];

        if (!token) {
            throw new Error("Failed to get token");
        }

        const secretKey = process.env["SECRET_KEY"];

        if (!secretKey) {
            throw new Error("Failed to get secret key");
        }

        const payload = jwt.verify(token, secretKey);

        req.user = payload as JWTPayload;

        next();
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
};
