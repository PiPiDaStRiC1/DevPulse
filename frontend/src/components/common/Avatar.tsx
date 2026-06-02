import { Link } from "react-router-dom";

interface AvatarProps {
    handle: string;
    size?: "xs" | "sm" | "md" | "lg";
    className?: string;
    isLoading?: boolean;
    isOnline?: boolean;
    link?: string;
}

const sizeMap = {
    xs: { cls: "w-7 h-7 min-w-7 text-[11px]", side: "28px" },
    sm: { cls: "w-9 h-9 min-w-9 text-[13px]", side: "36px" },
    md: { cls: "w-11 h-11 min-w-11 text-[15px]", side: "44px" },
    lg: { cls: "w-14 h-14 min-w-14 text-[18px]", side: "56px" },
};

const statusMap = {
    xs: { wrapper: "-bottom-0.5 -right-0.5", pulse: "h-2 w-2" },
    sm: { wrapper: "-bottom-0.5 -right-0.5", pulse: "h-2.5 w-2.5" },
    md: { wrapper: "-bottom-1 -right-1", pulse: "h-3 w-3" },
    lg: { wrapper: "-bottom-1.5 -right-1.5", pulse: "h-4.5 w-4.5" },
};

export const Avatar = ({
    handle,
    size = "md",
    className = "",
    isLoading = false,
    isOnline = false,
    link,
}: AvatarProps) => {
    const { cls } = sizeMap[size];
    const { wrapper, pulse } = statusMap[size];
    const initials = (handle ?? "")
        .split("@")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    if (isLoading) {
        return <div className={`sq-avatar ${cls} ${className} animate-pulse`} />;
    }

    if (link) {
        return (
            <Link
                to={link}
                className={`relative sq-avatar ${cls} ${className} bg-[var(--ink)] text-white`}
                title={handle}
            >
                {initials}
                {isOnline && (
                    <span className={`absolute ${wrapper}`} aria-label="Online status">
                        <span
                            className={`absolute inset-0 animate-ping rounded-full bg-emerald-400/45`}
                        />
                        <span
                            className={`relative block ${pulse} rounded-full border-2 border-bg bg-emerald-500 shadow-[0_0_0_1px_rgba(16,185,129,0.35)]`}
                        ></span>
                    </span>
                )}
            </Link>
        );
    }

    return (
        <div
            className={`relative sq-avatar ${cls} ${className} bg-[var(--ink)] text-white`}
            title={handle}
        >
            {initials}
            {isOnline && (
                <span className={`absolute ${wrapper}`} aria-label="Online status">
                    <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/45" />
                    <span
                        className={`relative block ${pulse} rounded-full border-2 border-bg bg-emerald-500 shadow-[0_0_0_1px_rgba(16,185,129,0.35)]`}
                    ></span>
                </span>
            )}
        </div>
    );
};
