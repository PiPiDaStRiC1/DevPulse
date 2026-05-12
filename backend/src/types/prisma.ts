import type { Prisma } from "@prisma/client";

export type PrismaUser = Prisma.UserGetPayload<{
    include: { _count: { select: { followers: true; following: true } }; followers: true };
}>;
