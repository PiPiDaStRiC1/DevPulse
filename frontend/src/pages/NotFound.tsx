import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ActivityIcon } from "lucide-react";

export const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex-1 min-w-0 flex flex-col items-center justify-center py-24 gap-10 select-none">
            <div className="relative">
                <p
                    className="text-[11rem] font-bold leading-none tracking-tighter text-bg"
                    style={{ WebkitTextStroke: "2.5px var(--ink)", letterSpacing: "-0.04em" }}
                >
                    404
                </p>
                <div
                    className="absolute -top-3 -right-4 w-10 h-10 bg-ink rounded-[var(--radius)] border-2 border-ink flex items-center justify-center"
                    style={{ boxShadow: "3px 3px 0 var(--ink-soft)" }}
                >
                    <ActivityIcon size={16} className="text-accent-fg" strokeWidth={2.5} />
                </div>
            </div>

            <div className="flex flex-col items-center gap-3 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-text-base">Nothing here.</h1>
                <p className="text-[14px] text-muted max-w-[280px] leading-relaxed">
                    The page you're looking for doesn't exist or has been moved.
                </p>
            </div>

            <div className="flex gap-3">
                <Link to="/" className="btn-solid">
                    ← Back to Feed
                </Link>
                <button onClick={() => navigate(-1)} className="btn-outline">
                    Go back
                </button>
            </div>
        </div>
    );
};
