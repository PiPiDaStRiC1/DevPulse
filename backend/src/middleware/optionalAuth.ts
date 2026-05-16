import jwt from "jsonwebtoken";
import type { Response, Request, NextFunction } from "express";
import type { ApiResponse, JWTPayload } from "@shared/types";

export const optionalAuth = (
    req: Request,
    _res: Response<ApiResponse<string>>,
    next: NextFunction,
) => {
    try {
        const token = req.headers["authorization"]?.split(" ")?.[1];

        if (!token) {
            return next();
        }

        const secretKey = process.env["SECRET_KEY"];

        if (!secretKey) {
            throw new Error("Failed to get secret key");
        }

        const payload = jwt.verify(token, secretKey);

        req.user = payload as JWTPayload;

        return next();
    } catch (error) {
        console.error(
            "Optional token verification failed:",
            error instanceof Error ? error.message : "Unknown error",
        );
        return next();
    }
};
