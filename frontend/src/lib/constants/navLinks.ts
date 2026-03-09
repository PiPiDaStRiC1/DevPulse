type NavId = "feed" | "explore" | "whispers" | "bookmarks";

export const navLinks: { id: NavId; label: string; path: string }[] = [
    { id: "feed", label: "Feed", path: "/" },
    { id: "explore", label: "Explore", path: "/explore" },
    { id: "whispers", label: "Whispers", path: "/whispers" },
    { id: "bookmarks", label: "Bookmarks", path: "/bookmarks" },
];
