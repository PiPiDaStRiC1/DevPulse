import { useCopyToClipboard } from "@/hooks";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Bookmark, Share2, Check } from "lucide-react";
import type { Post } from "@shared/types";

interface PostActionsProps {
    post: Post;
    toggleLikePost: (args: { postId: number; isLiked?: boolean }) => void;
    toggleBookmarkPost: (args: { postId: number; isBookmarked?: boolean }) => void;
}

export const PostActions = ({ post, toggleBookmarkPost, toggleLikePost }: PostActionsProps) => {
    const { copy, isCopied } = useCopyToClipboard();

    return (
        <div className="flex self-start items-center gap-3">
            <button
                className={`action-btn${post.isLiked ? " liked" : ""}`}
                onClick={() => toggleLikePost({ postId: post.id, isLiked: post.isLiked })}
                aria-label="Like"
            >
                <Heart size={16} fill={post.isLiked ? "currentColor" : "none"} />
                <span>{post.likes}</span>
            </button>

            <Link to={`/posts/${post.id}#comments`} className="action-btn" aria-label="Comment">
                <MessageCircle size={16} />
                <span>{post.comments}</span>
            </Link>

            <button className="action-btn" onClick={() => copy()} aria-label="Share">
                {isCopied ? <Check size={16} /> : <Share2 size={16} />}
            </button>

            <button
                onClick={() =>
                    toggleBookmarkPost({ postId: post.id, isBookmarked: post.isBookmarked })
                }
                className={`action-btn ml-auto${post.isBookmarked ? " bookmarked" : ""}`}
                aria-label="Bookmark"
            >
                <Bookmark size={16} fill={post.isBookmarked ? "currentColor" : "none"} />
            </button>
        </div>
    );
};
