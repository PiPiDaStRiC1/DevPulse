import { Hash } from "lucide-react";

export const TopicCardSkeleton = () => {
    return (
        <div className="card p-4 text-left cursor-pointer group bg-surface">
            <div className="w-8 h-8 rounded-[var(--radius)] mb-3 border-2 border-ink flex items-center justify-center">
                <Hash size={13} className="text-ink" />
            </div>
            <p className="text-[13px] font-bold text-text-base group-hover:underline">
                <span className="bg-ink-soft rounded-[var(--radius)] w-16 h-3 inline-block animate-pulse" />
            </p>
            <p className="text-[11px] text-muted mt-0.5">
                <span className="bg-ink-soft rounded-[var(--radius)] w-24 h-3 inline-block animate-pulse" />
            </p>
        </div>
    );
};
