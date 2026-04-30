export interface User {
    id: number;
    username: string;
    email: string;
    avatar: string | null;
    handle: string;
    bio: string | null;
    isVerified: boolean;
    followers: number;
    following: number;
    role: string;
    createdAt: Date;
}

export interface SuggestedUser extends User {
    mutualFollowers: number;
}
