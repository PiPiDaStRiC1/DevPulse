import { Heart, MessageCircle, Bookmark } from "lucide-react";

export const TrendingPostCardSkeleton = () => {
    return (
        <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-bg transition-colors border-b border-ink-soft">
            <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-subtle w-4 h-4 bg-ink-soft"></span>
                <div className="flex flex-col gap-1">
                    <p className="text-text-base font-bold bg-ink-soft h-5 w-30 animate-pulse"></p>
                    <p className="text-[11px] text-muted bg-ink-soft h-2 w-10 animate-pulse"></p>
                </div>
            </div>
            <div className="flex justify-center items-center flex-row gap-3">
                <span className="inline-flex items-center text-xs font-semibold text-muted">
                    <span className="bg-ink-soft h-4 w-4 animate-pulse"></span>
                    <Heart size={12} className="inline-block ml-1 text-red-500" />
                </span>
                <span className="inline-flex items-center text-xs font-semibold text-muted">
                    <span className="bg-ink-soft h-4 w-4 animate-pulse"></span>
                    <MessageCircle size={12} className="inline-block ml-1" />
                </span>
                <span className="inline-flex items-center text-xs font-semibold text-muted">
                    <span className="bg-ink-soft h-4 w-4 animate-pulse"></span>
                    <Bookmark size={12} className="inline-block ml-1" />
                </span>
            </div>
        </div>
    );
};
