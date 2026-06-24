import type { PrismaTag } from "@/types";
import type { TopicTag } from "@shared/types";

export const parseTopicTag = (tag: PrismaTag): TopicTag => {
    return {
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        postsCount: tag._count.tags,
        createdAt: tag.createdAt,
    };
};
