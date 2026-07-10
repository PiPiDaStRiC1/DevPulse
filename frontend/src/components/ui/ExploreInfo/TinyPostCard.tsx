import { Bookmark, Heart, MessageCircle } from "lucide-react";
import { useTogglePostStats } from "@/hooks";
import { ErrorAlert } from "@/components/common";
import { fmt, safeParseDate } from "@/lib/utils";
import { Link } from "react-router-dom";
import type { Post } from "@shared/types";

interface TinyPostCardProps {
    post: Post;
}

export const TinyPostCard = ({ post }: TinyPostCardProps) => {
    const { toggleLikePost, toggleBookmarkPost, isErrorAuthor, author } = useTogglePostStats(
        post.authorId,
    );

    if (isErrorAuthor) {
        return <ErrorAlert message="Failed to load author information" />;
    }

    if (!author) {
        return <ErrorAlert message="Failed to fetch author information" />;
    }

    return (
        <article className="card p-5 flex flex-col gap-2">
            <Link to={`/posts/${post.id}`} className="mb-2 text-xl font-extrabold hover:underline">
                {post.title}
            </Link>

            <div className="flex items-center gap-2 text-sm text-subtle">
                <Link to={`/profile/${author.handle}`} className="flex gap-2 hover:underline">
                    <span className="font-semibold text-text-base">{author.username}</span>
                    <span>@{author.handle}</span>
                </Link>

                <span>·</span>

                <span>{safeParseDate(post.createdAt)}</span>

                <span>·</span>

                <span>{post.readTime} min read</span>
            </div>

            <div className="flex items-center gap-1 text-subtle">
                <div
                    className={`action-btn${post.isLiked ? " liked" : ""}`}
                    onClick={() => toggleLikePost({ postId: post.id, isLiked: post.isLiked })}
                    aria-label="Like"
                >
                    <Heart size={16} fill={post.isLiked ? "currentColor" : "none"} />
                    <span>{fmt(post.likes)}</span>
                </div>

                <Link to={`/posts/${post.id}#comments`} className="action-btn" aria-label="Comment">
                    <MessageCircle size={16} />
                    <span>{fmt(post.comments)}</span>
                </Link>

                <button
                    onClick={() =>
                        toggleBookmarkPost({ postId: post.id, isBookmarked: post.isBookmarked })
                    }
                    className={`action-btn ml-auto${post.isBookmarked ? " bookmarked" : ""}`}
                    aria-label="Bookmark"
                >
                    <Bookmark size={16} fill={post.isBookmarked ? "currentColor" : "none"} />
                    <span>{fmt(post.bookmarks)}</span>
                </button>
            </div>
        </article>
    );
};
