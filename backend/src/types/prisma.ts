import type { Prisma } from "@prisma/client";

export type PrismaUser = Prisma.UserGetPayload<{
    include: {
        _count: {
            select: { followers: true; following: true; likes: true; comments: true; posts: true };
        };
        followers: true;
    };
}>;

export type PrismaPost = Prisma.PostGetPayload<{
    include: {
        comments: true;
        tags: true;
        codeSnippet: true;
        techStack: true;
        _count: { select: { likes: true } };
        likes: true;
    };
}>;