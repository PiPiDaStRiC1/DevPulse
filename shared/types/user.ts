export interface User {
    id: number;
    username: string;
    email: string;
    handle: string;
    bio: string | null;
    isVerified: boolean;
    followers: number;
    following: number;
    role: string;
}

export interface SuggestedUser extends User {
    mutualFollowers: number;
}
