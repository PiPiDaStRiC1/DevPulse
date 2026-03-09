export interface User {
    id: string;
    username: string;
    handle: string;
    avatarColor: string;
    bio: string;
    isVerified: boolean;
    followers: number;
    following: number;
    role: string;
}

export interface CodeSnippet {
    language: string;
    code: string;
}

export interface Post {
    id: string;
    author: User;
    content: string;
    tags: string[];
    techStack: string[];
    likes: number;
    comments: number;
    reposts: number;
    bookmarks: number;
    createdAt: string;
    isLiked: boolean;
    isBookmarked: boolean;
    isReposted: boolean;
    image?: string;
    codeSnippet?: CodeSnippet;
}

export interface TrendingTopic {
    id: string;
    tag: string;
    posts: number;
    category: string;
}

export interface SuggestedUser extends User {
    mutualFollowers: number;
}
