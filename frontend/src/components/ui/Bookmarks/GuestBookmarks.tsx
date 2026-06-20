import { Link, useLocation } from "react-router-dom";
import { Bookmark, LogIn } from "lucide-react";

export const GuestBookmarks = () => {
    const location = useLocation();

    return (
        <div className="flex-1 min-h-[calc(100vh-10rem)] flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-2xl p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none opacity-70">
                    <div className="absolute -top-14 right-10 w-36 h-36 rounded-full bg-av-green/10 blur-3xl" />
                    <div className="absolute bottom-0 left-6 w-44 h-44 rounded-full bg-av-teal/10 blur-3xl" />
                </div>

                <div className="relative flex flex-col items-center text-center gap-5">
                    <div className="relative">
                        <div
                            className="w-20 h-20 bg-ink rounded-[var(--radius)] border-2 border-ink flex items-center justify-center"
                            style={{ boxShadow: "4px 4px 0 var(--ink-soft)" }}
                        >
                            <Bookmark size={38} className="text-surface" strokeWidth={2} />
                        </div>
                        <div
                            className="absolute -top-2 -right-2 w-7 h-7 bg-surface border-2 border-ink rounded-full flex items-center justify-center text-xs font-bold text-ink"
                            style={{ boxShadow: "2px 2px 0 var(--ink)" }}
                        >
                            ?
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-3 max-w-md">
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-ink">
                            No bookmarks yet
                        </h2>
                        <p className="leading-relaxed text-muted">
                            Sign in to save articles, guides, and references for later reading. Your
                            bookmark shelf will appear here once you start collecting posts.
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
        </div>
    );
};
