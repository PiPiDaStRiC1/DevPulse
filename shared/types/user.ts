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

export interface SuggestedUser extends User {
    mutualFollowers: number;
}
