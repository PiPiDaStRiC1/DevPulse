type NavId = "feed" | "explore" | "whispers" | "bookmarks";

interface NavLink {
    id: NavId;
    label: string;
    path: string;
    isProtected: boolean;
}

export const navLinks: NavLink[] = [
    { id: "feed", label: "Feed", path: "/", isProtected: false },
    { id: "explore", label: "Explore", path: "/explore", isProtected: false },
    { id: "whispers", label: "Whispers", path: "/whispers", isProtected: true },
    { id: "bookmarks", label: "Bookmarks", path: "/bookmarks", isProtected: true },
];
