import type { SummaryPost } from "@shared/types";
import { safeParseDate } from "@/lib/utils";
import { Link } from "react-router-dom";

interface SearchCardProps {
    post: SummaryPost;
    index: number;
}

export const SearchCard = ({ post, index }: SearchCardProps) => {
    return (
        <Link
            to={`/posts/${post.id}`}
            className="flex items-center gap-3 p-2 border-b border-border-light last:border-b-0 hover:bg-bg transition-colors"
        >
            <div className="flex-shrink-0 text-sm font-bold text-ink w-3 text-center">{index}.</div>

            <div className="flex flex-col min-w-0 gap-0.5">
                <h3 className="text-text-base font-semibold truncate">{post.title}</h3>

                <p className="text-xs text-text-secondary truncate">
                    {post.author.username}{" "}
                    <span className="text-text-base font-semibold">(@{post.author.handle})</span>
                </p>
                <p className="text-xs text-text-secondary truncate">
                    {safeParseDate(post.createdAt)}
                </p>
            </div>
        </Link>
    );
};
