import jwt from "jsonwebtoken";
import type { JWTPayload } from "@shared/types";

export const verifyToken = (token: string | undefined): JWTPayload => {
    if (!token) {
        throw new Error("Failed to get token");
    }

    const secretKey = process.env["SECRET_KEY"];

    if (!secretKey) {
        throw new Error("Failed to get secret key");
    }

    const payload = jwt.verify(token, secretKey);

    return payload as JWTPayload;
};
