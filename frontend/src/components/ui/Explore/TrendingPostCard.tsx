import { fmt } from "@/lib/utils";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import type { TrendingPost } from "@shared/types";
import { Link } from "react-router-dom";

interface TrendingPostCardProps {
    trendingPost: TrendingPost;
    index: number;
}

export const TrendingPostCard = ({ trendingPost, index }: TrendingPostCardProps) => {
    return (
        <Link
            to={`/posts/${trendingPost.id}`}
            className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-bg transition-colors border-b border-ink-soft"
        >
            <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-subtle text-right"># {index}</span>
                <div className="flex flex-col gap-1">
                    <p className="text-text-base font-bold">{trendingPost.title} </p>
                    <p className="text-[11px] text-muted">Author: {trendingPost.author.handle}</p>
                </div>
            </div>
            <div className="flex justify-center items-center flex-row gap-3">
                <span className="inline-flex items-center text-xs font-semibold text-muted">
                    {fmt(trendingPost.likes)}
                    <Heart size={12} className="inline-block ml-1 text-red-500" />
                </span>
                <span className="inline-flex items-center text-xs font-semibold text-muted">
                    {fmt(trendingPost.comments)}
                    <MessageCircle size={12} className="inline-block ml-1" />
                </span>
                <span className="inline-flex items-center text-xs font-semibold text-muted">
                    {fmt(trendingPost.bookmarks)}
                    <Bookmark size={12} className="inline-block ml-1" />
                </span>
            </div>
        </Link>
    );
};
