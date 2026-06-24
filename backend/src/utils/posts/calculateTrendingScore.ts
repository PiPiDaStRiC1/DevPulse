const BASE_WEIGHTS_FOR_SCORE = { like: 1, comment: 3, bookmark: 5, time: 2 } as const;

export const calculateTrendingScore = (
    likes: number,
    comments: number,
    bookmarks: number,
    createdAt: Date,
) => {
    const ageHours = Date.now() - createdAt.getTime() / 3600000;

    return (
        (likes * BASE_WEIGHTS_FOR_SCORE.like +
            comments * BASE_WEIGHTS_FOR_SCORE.comment +
            bookmarks * BASE_WEIGHTS_FOR_SCORE.bookmark) /
        Math.pow(ageHours + BASE_WEIGHTS_FOR_SCORE.time, 1.2)
    );
};
