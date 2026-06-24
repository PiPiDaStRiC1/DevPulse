export const calculateTrendingScore = (
    likes: number,
    comments: number,
    bookmarks: number,
    createdAt: Date,
) => {
    return (
        likes + comments * 3 + bookmarks * 5 - (Date.now() - createdAt.getTime() / 3600000) * 1.5
    );
};
