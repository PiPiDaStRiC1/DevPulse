import { z } from "zod";

export const codeSnippetSchema = z.object({
    language: z.string().nullable(),
    code: z.string().nullable(),
});

export const postCreateSchema = z.object({
    title: z.string().trim().min(1, { message: "Title is required" }),
    coverImage: z.string().nullable().optional().default(null),
    content: z
        .string()
        .trim()
        .min(1, { message: "Content is required" })
        .max(30000, { message: "Content must be less than 30000 characters" }),
    tags: z
        .array(z.string().trim().min(1, { message: "Tag cannot be empty" }))
        .optional()
        .default([]),
    techStack: z
        .array(z.string().trim().min(1, { message: "Tech stack item cannot be empty" }))
        .optional()
        .default([]),
    comments: z.array(z.any()).optional().default([]),
    image: z.string().nullable().optional().default(null),
    codeSnippet: codeSnippetSchema.nullable().optional().default(null),
});

export type PostCreateSchema = z.infer<typeof postCreateSchema>;
