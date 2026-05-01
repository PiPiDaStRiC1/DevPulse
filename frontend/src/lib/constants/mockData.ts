import type { User, TrendingTopic, SuggestedUser } from "@shared/types";

export const currentUser: User = {
    id: 4,
    username: "You",
    handle: "your_handle",
    avatar: null,
    bio: "Full-stack dev learning in public 🚀",
    isVerified: false,
    followers: 128,
    following: 94,
    role: "Full-stack Dev",
    email: "you@example.com",
    createdAt: new Date("2023-01-01"),
};

export const trendingTopics: TrendingTopic[] = [
    { id: 0, tag: "TypeScript", posts: 12400, category: "Language" },
    { id: 1, tag: "ReactServer", posts: 8710, category: "Framework" },
    { id: 2, tag: "Rust2025", posts: 6230, category: "Language" },
    { id: 3, tag: "AICodeReview", posts: 5980, category: "AI/ML" },
    { id: 4, tag: "OpenSource", posts: 4410, category: "Community" },
];

export const suggestedUsers: SuggestedUser[] = [
    { ...currentUser, id: 0, username: "john_doe", mutualFollowers: 18 },
    { ...currentUser, id: 1, username: "jane_smith", mutualFollowers: 11 },
    { ...currentUser, id: 2, username: "alice_jones", mutualFollowers: 7 },
];
