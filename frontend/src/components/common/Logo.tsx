import { ActivityIcon } from "lucide-react";

export const Logo = () => {
    return (
        <div className="flex items-center gap-2">
            <div
                className="border-2 border-ink p-1 rounded-[var(--radius)]"
                style={{ boxShadow: "2px 2px 0 var(--ink)" }}
            >
                <ActivityIcon size={16} className="text-ink" />
            </div>
            <span className="text-xl font-bold tracking-tight select-none text-text-base">
                DevPulse
            </span>
        </div>
    );
};
