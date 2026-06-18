import { Link } from "react-router-dom";
import { Avatar } from "@/components";
import type { RelatedPost as RelatedPostType } from "@shared/types";

interface RelatedPostsProps {
    post: RelatedPostType;
}

export const RelatedPost = ({ post }: RelatedPostsProps) => {
    return (
        <div className="group block rounded-md border-2 border-ink bg-bg p-3 shadow-[2px_2px_0_var(--ink)] transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--ink)]">
            <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                    <Avatar handle={post.author.handle} link={`/profile/${post.author.handle}`} />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <Link
                                to={`/posts/${post.id}`}
                                className="truncate text-sm font-extrabold leading-tight text-text-base group-hover:underline"
                            >
                                {post.title}
                            </Link>
                            <div className="flex items-center gap-1.5 text-[11px] text-subtle">
                                <span className="font-semibold text-text-base">
                                    {post.author.username}
                                </span>
                                <p className="truncate text-xs text-muted">@{post.author.handle}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="font-semibold text-[12px] text-subtle">
                            {post.readTime} min read
                        </span>
                        <span className="shrink-0 rounded-full border border-ink-soft bg-surface px-2 py-0.5 text-[11px] font-semibold text-subtle">
                            {post.likes} likes
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
