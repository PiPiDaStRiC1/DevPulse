import { compare, genSalt, hash } from "bcrypt";
import { prisma } from "@/helpers";
import { createAccessToken } from "@/helpers";
import { Prisma } from "@prisma/client";
import type { AuthResponse } from "@shared/types";
import type { LoginSchema, RegisterSchema } from "@shared/schemas";
import type { Request, Response } from "express";

const hashedPassword = async (password: string) => {
    const SALT = await genSalt(12);

    return await hash(password, SALT);
};

export const loginUser = async (
    req: Request<{}, {}, LoginSchema, {}>,
    res: Response<AuthResponse>,
) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, error: "Invalid email or password" });
        }

        const { password: _, ...userWithoutPassword } = user;

        const token = createAccessToken(user.id);

        return res.status(200).json({ success: true, data: { token, user: userWithoutPassword } });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ success: false, error: "Failed to login user" });
    }
};

export const registerUser = async (
    req: Request<{}, {}, Omit<RegisterSchema, "confirmPassword">, {}>,
    res: Response<AuthResponse>,
) => {
    try {
        const { email, password, handle, username } = req.body;

        const hashed = await hashedPassword(password);

        const user = await prisma.user.create({
            data: { email, password: hashed, handle, username },
        });

        const { password: _, ...userWithoutPassword } = user;

        const token = createAccessToken(user.id);

        return res.status(201).json({ success: true, data: { token, user: userWithoutPassword } });
    } catch (error) {
        console.error("Registration error:", error);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // P2002 is a unique constraint violation error code in Prisma
            if (error.code === "P2002") {
                if (error.message.includes("email")) {
                    return res
                        .status(400)
                        .json({ success: false, error: "Email already registered" });
                }
                if (error.message.includes("handle")) {
                    return res.status(400).json({ success: false, error: "Handle already taken" });
                }
            }
        }

        return res.status(500).json({ success: false, error: "Failed to register user" });
    }
};
