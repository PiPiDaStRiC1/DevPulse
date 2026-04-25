import { ActivityIcon } from "lucide-react";

interface LogoProps {
    theme?: "dark" | "light";
    size?: "sm" | "md" | "lg";
    className?: string;
}

const sizeMap = {
    sm: {
        icon: 14,
        wrapper: "p-1",
        text: "text-lg",
    },
    md: {
        icon: 16,
        wrapper: "p-1",
        text: "text-xl",
    },
    lg: {
        icon: 18,
        wrapper: "p-1.5",
        text: "text-2xl",
    },
};

export const Logo = ({ theme = "dark", size = "md", className = "" }: LogoProps) => {
    const isLight = theme === "light";
    const palette = isLight
        ? {
              border: "border-accent-fg",
              icon: "text-accent-fg",
              text: "text-accent-fg",
              shadow: "2px 2px 0 var(--accent-fg)",
          }
        : {
              border: "border-ink",
              icon: "text-ink",
              text: "text-text-base",
              shadow: "2px 2px 0 var(--ink)",
          };
    const currentSize = sizeMap[size];

    return (
        <div className={`z-9999 flex items-center gap-2 ${className}`.trim()}>
            <div
                className={`border-2 rounded-[var(--radius)] ${palette.border} ${currentSize.wrapper}`}
                style={{ boxShadow: palette.shadow }}
            >
                <ActivityIcon size={currentSize.icon} className={palette.icon} />
            </div>
            <span className={`${currentSize.text} font-bold tracking-tight select-none ${palette.text}`}>
                DevPulse
            </span>
        </div>
    );
};
