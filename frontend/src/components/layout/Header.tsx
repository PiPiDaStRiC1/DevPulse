import { Link } from "react-router-dom";
import { useState } from "react";
import { Logo, Avatar } from "@/components/common";
import type { User } from "@/types";

type NavId = "feed" | "explore" | "whispers" | "bookmarks";

const navItems: { id: NavId; label: string; path: string }[] = [
    { id: "feed", label: "Feed", path: "/" },
    { id: "explore", label: "Explore", path: "/explore" },
    { id: "whispers", label: "Whispers", path: "/whispers" },
];

interface HeaderProps {
    currentUser: User;
}

export const Header = ({ currentUser }: HeaderProps) => {
    const [active, setActive] = useState<NavId>("feed");

    return (
        <header className="border-b-2 z-100 px-2 border-ink sticky bg-bg top-0 flex items-center px-5 gap-6 h-12">
            <Logo />
            <nav className="flex gap-2 flex-1">
                {navItems.map(({ id, label, path }) => (
                    <Link
                        key={id}
                        to={path}
                        onClick={() => setActive(id)}
                        className={`nav-btn${active === id ? " active" : ""}`}
                    >
                        {label}
                    </Link>
                ))}
            </nav>

            <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-md text-muted">@{currentUser.handle}</span>
                <Avatar user={currentUser} size="sm" />
            </div>
        </header>
    );
};
