import type { User } from "@/types";

interface AvatarProps {
    user: Pick<User, "username" | "avatarColor">;
    size?: "xs" | "sm" | "md" | "lg";
    className?: string;
}

const sizeMap = {
    xs: { cls: "w-7 h-7 min-w-7 text-[11px]", side: "28px" },
    sm: { cls: "w-9 h-9 min-w-9 text-[13px]", side: "36px" },
    md: { cls: "w-11 h-11 min-w-11 text-[15px]", side: "44px" },
    lg: { cls: "w-14 h-14 min-w-14 text-[18px]", side: "56px" },
};

export const Avatar = ({ user, size = "md", className = "" }: AvatarProps) => {
    const { cls } = sizeMap[size];
    const initials = user.username
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <div
            className={`sq-avatar ${cls} ${className}`}
            style={{ background: user.avatarColor, color: "#fff" }}
            title={user.username}
        >
            {initials}
        </div>
    );
};
