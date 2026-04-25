import { z } from "zod";

export const codeSnippetSchema = z.object({
    language: z.string().nullable(),
    code: z.string().nullable(),
});

export const postCreateSchema = z.object({
    content: z
        .string()
        .min(1, { message: "Content is required" })
        .max(5000, { message: "Content must be less than 5000 characters" }),
    tags: z
        .array(z.string().min(1, { message: "Tag cannot be empty" }))
        .min(0, { message: "Tags must be an array" }),
    techStack: z
        .array(z.string().min(1, { message: "Tech stack item cannot be empty" }))
        .min(0, { message: "Tech stack must be an array" }),
    comments: z.array(z.any()).optional().default([]),
    image: z.string().nullable(),
    codeSnippet: codeSnippetSchema.nullable(),
});

export type PostCreateSchema = z.infer<typeof postCreateSchema>;
