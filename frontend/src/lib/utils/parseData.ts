export const safeParseDate = (date: Date | undefined) => {
    const createdAt = date ? new Date(date) : null;
    const postDateLabel =
        createdAt && !Number.isNaN(createdAt.getTime())
            ? createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })
            : "Unknown date";

    return postDateLabel;
};
