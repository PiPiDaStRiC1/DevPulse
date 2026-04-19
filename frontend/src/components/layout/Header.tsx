import { Link, NavLink, useLocation } from "react-router-dom";
import { Logo } from "@/components/common";
import { navLinks } from "@/lib/constants";
import { LogIn, User, PenLine } from "lucide-react";
import { useSession } from "@/hooks";

export const Header = () => {
    const location = useLocation();
    const { isAuthenticated } = useSession();

    return (
        <header className="border-b-2 z-50 px-2 border-ink sticky bg-bg top-0 flex items-center px-5 gap-6 p-2">
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
            {isAuthenticated ? (
                <>
                    <Link
                        to="/editor"
                        state={{ background: location }}
                        className="btn-solid whitespace-nowrap py-2.5 px-4"
                    >
                        <PenLine size={15} />
                        Create post
                    </Link>
                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            `${isActive ? "bg-ink text-white" : "text-ink"} border-2 border-ink p-2 rounded-[var(--radius)]`
                        }
                        style={{ boxShadow: "2px 2px 0 var(--ink)" }}
                    >
                        <User size={20} />
                    </NavLink>
                </>
            ) : (
                <Link
                    to="/auth"
                    state={{ background: location }}
                    className="btn-solid flex gap-2 text-sm"
                >
                    <LogIn size={20} />
                    Sign Up
                </Link>
            )}
        </header>
    );
};
