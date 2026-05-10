import { Link, useLocation } from "react-router-dom";
import { MessageCircle, LogIn } from "lucide-react";

export const GuestWhispers = () => {
    const location = useLocation();

    return (
        <div className="flex-1 h-[calc(100vh-10rem)] flex">
            <div className="w-full flex flex-col items-center justify-center px-6 gap-4 text-muted">
                <div className="relative">
                    <div
                        className="w-20 h-20 bg-ink rounded-[var(--radius)] border-2 border-ink flex items-center justify-center"
                        style={{ boxShadow: "4px 4px 0 var(--ink-soft)" }}
                    >
                        <MessageCircle size={40} className="text-surface" strokeWidth={2} />
                    </div>
                    <div
                        className="absolute -top-2 -right-2 w-7 h-7 bg-surface border-2 border-ink rounded-full flex items-center justify-center text-xs font-bold text-ink"
                        style={{ boxShadow: "2px 2px 0 var(--ink)" }}
                    >
                        ?
                    </div>
                </div>

                <div className="flex flex-col items-center gap-3 text-center max-w-sm">
                    <h2 className="text-2xl font-bold text-ink">No messages yet</h2>
                    <p className="leading-relaxed">
                        Sign in to your account to view and manage your conversations with other
                        developers.
                    </p>
                </div>

                <Link
                    to="/auth"
                    state={{ background: location }}
                    className="btn-solid flex items-center gap-2 whitespace-nowrap"
                >
                    <LogIn size={16} />
                    Sign In
                </Link>

                <p className="text-xs mt-4">
                    or explore{" "}
                    <Link
                        to="/explore"
                        className="underline font-semibold hover:text-ink transition-colors"
                    >
                        public profiles
                    </Link>
                </p>
            </div>
        </div>
    );
};
