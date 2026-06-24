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
        tags: { select: { tag: { select: { name: true } } } };
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
                tags: { select: { tag: { select: { name: true } } } };
            };
        };
    };
}>;

export type PrismaTag = Prisma.TagGetPayload<{ include: { _count: { select: { tags: true } } } }>;

export type PrismaTrendingPost = Prisma.PostGetPayload<{
    select: {
        id: true;
        title: true;
        createdAt: true;
        author: { select: { username: true; avatar: true; handle: true } };
        _count: { select: { likes: true; bookmarks: true; comments: true } };
    };
}>;