import { Link, NavLink } from "react-router-dom";
import { Logo, Avatar } from "@/components/common";
import { navLinks } from "@/lib/constants";
import type { User } from "@/types";

interface HeaderProps {
    currentUser: User;
}

export const Header = ({ currentUser }: HeaderProps) => {
    return (
        <header className="border-b-2 z-100 px-2 border-ink sticky bg-bg top-0 flex items-center px-5 gap-6 h-12">
            <Link to="/">
                <Logo />
            </Link>
            <nav className="flex gap-2 flex-1">
                {navLinks.map(({ id, label, path }) => (
                    <NavLink
                        key={id}
                        to={path}
                        className={({ isActive }) => `nav-btn${isActive ? " active" : ""}`}
                    >
                        {label}
                    </NavLink>
                ))}
            </nav>

            <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-md text-muted">@{currentUser.handle}</span>
                <Avatar user={currentUser} size="sm" />
            </div>
        </header>
    );
};
