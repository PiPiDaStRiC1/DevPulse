import type { User, TrendingTopic, SuggestedUser, Chat, Message } from "@shared/types";

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

export const CHATS: Chat[] = [
    {
        id: 1,
        collocutor: suggestedUsers[0]!,
        updatedAt: new Date(),
        lastMessage: {
            id: 11,
            chatId: 1,
            senderId: suggestedUsers[0]!.id,
            createdAt: new Date(),
            text: "Worth every borrow checker error lol",
        },
        unreadCount: 1,
    },
    {
        id: 2,
        collocutor: suggestedUsers[1]!,
        updatedAt: new Date(),
        lastMessage: {
            id: 12,
            chatId: 2,
            senderId: suggestedUsers[1]!.id,
            createdAt: new Date(),
            text: "Just pushed a new feature — let me know what you think!",
        },
        unreadCount: 2,
    },
    {
        id: 3,
        collocutor: suggestedUsers[2]!,
        updatedAt: new Date(),
        lastMessage: {
            id: 13,
            chatId: 3,
            senderId: suggestedUsers[2]!.id,
            createdAt: new Date(),
            text: "ok but Rust ownership model is just chef's kiss",
        },
        unreadCount: 1,
    },
];

export const MESSAGES: Message[] = [
    {
        id: 11,
        chatId: 1,
        senderId: suggestedUsers[2]!.id,
        createdAt: new Date(),
        text: "Worth every borrow checker error lol",
    },
    { id: 1, chatId: 1, senderId: currentUser.id, text: "That`s good!", createdAt: new Date() },
    {
        id: 12,
        chatId: 2,
        senderId: suggestedUsers[1]!.id,
        createdAt: new Date(),
        text: "Just pushed a new feature — let me know what you think!",
    },
    { id: 2, chatId: 2, senderId: currentUser.id, text: "Saprikin legend", createdAt: new Date() },
    {
        id: 13,
        chatId: 3,
        senderId: suggestedUsers[2]!.id,
        createdAt: new Date(),
        text: "ok but Rust ownership model is just chef's kiss",
    },
    { id: 3, chatId: 3, senderId: currentUser.id, text: "Ok, no problem", createdAt: new Date() },
];
