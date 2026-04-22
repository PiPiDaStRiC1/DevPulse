interface AvatarProps {
    handle: string;
    size?: "xs" | "sm" | "md" | "lg";
    className?: string;
    isLoading?: boolean;
}

const sizeMap = {
    xs: { cls: "w-7 h-7 min-w-7 text-[11px]", side: "28px" },
    sm: { cls: "w-9 h-9 min-w-9 text-[13px]", side: "36px" },
    md: { cls: "w-11 h-11 min-w-11 text-[15px]", side: "44px" },
    lg: { cls: "w-14 h-14 min-w-14 text-[18px]", side: "56px" },
};

export const Avatar = ({ handle, size = "md", className = "", isLoading = false }: AvatarProps) => {
    const { cls } = sizeMap[size];
    const initials = (handle ?? "")
        .split("@")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <>
            {isLoading ? (
                <div className={`sq-avatar ${cls} ${className} animate-pulse`} />
            ) : (
                <div
                    className={`sq-avatar ${cls} ${className} bg-[var(--ink)] text-white`}
                    title={handle}
                >
                    {initials}
                </div>
            )}
        </>
    );
};
