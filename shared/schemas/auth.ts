import { z } from "zod";

const handleRegex = /^@?[a-zA-Z0-9_]+$/;
const passwordRegExp = /^(?=.*[A-ZА-ЯЁ])(?=.*\d).{8,}$/;

const handleSchema = z
    .string()
    .trim()
    .min(1, { error: "Includes more than one symbol" })
    .regex(handleRegex, { message: "Includes letters, numbers, and '@', '_' symbols" })
    .transform((value) => value.replace(/^@+/, ""));

export const loginSchema = z.object({
    email: z.email("Incorrect email"),
    password: z
        .string()
        .regex(passwordRegExp, {
            message:
                "Includes at least 8 characters long, include at least one uppercase letter and one number",
        }),
});

export const registerSchema = z
    .object({
        username: z.string().min(2, { error: "Includes more than two symbol" }),
        handle: handleSchema,
        email: z.email("Incorrect email"),
        password: z
            .string()
            .regex(passwordRegExp, {
                message:
                    "Includes at least 8 characters long, include at least one uppercase letter and one number",
            }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
