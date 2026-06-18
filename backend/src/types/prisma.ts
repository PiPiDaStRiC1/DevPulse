import type { Prisma } from "@prisma/client";

export type PrismaUser = Prisma.UserGetPayload<{
    include: {
        _count: {
            select: {
                followers: true;
                following: true;
                likes: true;
                comments: true;
                posts: true;
                bookmarks: true;
            };
        };
        followers: true;
    };
}>;

export type PrismaPost = Prisma.PostGetPayload<{
    include: {
        tags: true;
        codeSnippet: true;
        techStack: true;
        bookmarks: true;
        _count: { select: { likes: true; comments: true } };
        likes: true;
    };
}>;

export type PrismaBookmark = Prisma.BookmarkGetPayload<{
    select: {
        id: true;
        createdAt: true;
        post: {
            select: {
                id: true;
                title: true;
                excerpt: true;
                author: { select: { username: true; avatar: true; handle: true } };
                tags: true;
            };
        };
    };
}>;