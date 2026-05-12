import { compare, genSalt, hash } from "bcrypt";
import { prisma, createAccessToken } from "@/helpers";
import { parseUser } from "@/utils";
import { Prisma } from "@prisma/client";
import { loginSchema, registerSchema } from "@shared/schemas";
import type { AuthResponse, MeResponse } from "@shared/types";
import type { LoginSchema, RegisterSchema } from "@shared/schemas";
import type { Request, Response } from "express";

const hashedPassword = async (password: string) => {
    const SALT = await genSalt(12);

    return await hash(password, SALT);
};

export const fetchMe = async (req: Request, res: Response<MeResponse>) => {
    try {
        const { userId } = req.user!;

        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            include: { _count: { select: { followers: true, following: true } } },
        });

        if (!currentUser) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        return res.status(200).json({ success: true, data: parseUser(currentUser) });
    } catch (error) {
        console.error("Fetch user error:", error);
        return res.status(500).json({ success: false, error: "Failed to fetch user" });
    }
};

export const loginUser = async (
    req: Request<{}, {}, LoginSchema, {}>,
    res: Response<AuthResponse>,
) => {
    try {
        const { email, password } = req.body;
        const parsed = loginSchema.safeParse({ email, password });

        if (!parsed.success) {
            return res.status(400).json({ success: false, error: "Invalid email or password" });
        }

        const user = await prisma.user.findUnique({
            where: { email },
            include: { _count: { select: { followers: true, following: true } } },
        });

        if (!user) {
            return res.status(401).json({ success: false, error: "Invalid email or password" });
        }

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, error: "Invalid email or password" });
        }

        const token = createAccessToken(user.id);

        return res.status(200).json({ success: true, data: { token, user: parseUser(user) } });
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

        const parsed = registerSchema.safeParse({
            email,
            password,
            handle,
            username,
            confirmPassword: password,
        });

        if (!parsed.success) {
            return res.status(400).json({ success: false, error: "Invalid user data" });
        }

        const hashed = await hashedPassword(password);

        const user = await prisma.user.create({
            data: { email, password: hashed, handle, username },
            include: { _count: { select: { followers: true, following: true } } },
        });

        const token = createAccessToken(user.id);

        return res.status(201).json({ success: true, data: { token, user: parseUser(user) } });
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

export const refreshToken = async (_req: Request, _res: Response) => {
    // try {
    //     const { token } = req.user!;
    //     if (!token) {
    //         throw new Error("Failed to get token");
    //     }
    //     const decoded = jwt.decode(token, { json: true });
    //     const expirationTime = decoded?.exp;
    //     if (!expirationTime) {
    //         throw new Error("Failed to get expriration time");
    //     }
    // } catch (error) {
    //     if (error instanceof Error) {
    //         res.status(400).json({ success: false, error: error.message });
    //     }
    // }
};