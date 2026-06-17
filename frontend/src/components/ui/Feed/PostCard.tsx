import { Heart, MessageCircle, Bookmark, Share2, BadgeCheck, Check } from "lucide-react";
import { Avatar, ErrorAlert, PostSkeleton } from "@/components";
import { CustomReactMarkdown } from "@/features";
import { safeParseDate } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useTogglePostStats, useCopyToClipboard } from "@/hooks";
import type { Post } from "@shared/types";

interface PostCardProps {
    post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
    const { copy, isCopied } = useCopyToClipboard();
    const { toggleLikePost, toggleBookmarkPost, isErrorAuthor, isLoadingAuthor, author } =
        useTogglePostStats(post.authorId);

    const fmt = (n: number | undefined) => (n && n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n);

    const MAX = 200;
    const isLong = post.content && post.content.length > MAX;
    const preview = isLong ? `${post.content.slice(0, MAX).trimEnd()}...` : post.content;

    if (isErrorAuthor) {
        return <ErrorAlert message="Failed to load author information" />;
    }

    if (isLoadingAuthor) {
        return <PostSkeleton />;
    }

    if (!author) {
        return <ErrorAlert message="Failed to fetch author information" />;
    }

    return (
        <article className="card p-0 mb-4 overflow-hidden">
            <div className="p-4 sm:p-5">
                <div className="flex gap-3.5">
                    <Avatar
                        handle={author.handle}
                        size="sm"
                        link={`/profile/${author.handle}`}
                        isLoading={isLoadingAuthor}
                    />

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap text-[12px] leading-tight">
                            <span className="font-semibold text-text-base">{author.username}</span>
                            {author.isVerified && (
                                <BadgeCheck size={13} className="text-av-blue shrink-0" />
                            )}
                            <span className="text-muted">@{author.handle}</span>
                            <span className="text-subtle">·</span>
                            <span className="text-subtle">{safeParseDate(post.createdAt)}</span>
                            <span className="text-subtle">·</span>
                            <span className="text-subtle">~{post.readTime} min read</span>
                        </div>

                        <div className="preview-markdown py-2">
                            <Link
                                to={`/posts/${post.id}`}
                                className="!no-underline hover:!underline"
                            >
                                <h1 className="preview-markdown">{post.title}</h1>
                            </Link>
                            <CustomReactMarkdown content={preview} />
                            {isLong && (
                                <div className="mt-2">
                                    <Link
                                        to={`/posts/${post.id}`}
                                        className="btn-outline inline-flex items-center gap-2 !py-1 !px-3 !text-sm"
                                        aria-label={`Read more about ${post.title}`}
                                    >
                                        Read more
                                    </Link>
                                </div>
                            )}
                        </div>

                        {post.coverImage && (
                            <div className="border-2 border-ink rounded-lg flex items-center justify-center">
                                <img src={post.coverImage} alt="user-picture" />
                            </div>
                        )}

                        {post.codeSnippet && (
                            <div className="code-block mt-4 px-4 py-3.5">
                                <div className="flex items-center gap-2 mb-2.5">
                                    <div className="flex gap-1">
                                        {["#e05252", "#e0a852", "#52c752"].map((c) => (
                                            <div
                                                key={c}
                                                className="w-2.5 h-2.5 rounded-full border border-ink"
                                                style={{ background: c }}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs font-semibold text-muted">
                                        {post.codeSnippet.language}
                                    </span>
                                </div>
                                <pre className="whitespace-pre-wrap break-words">
                                    <code>{post.codeSnippet.code}</code>
                                </pre>
                            </div>
                        )}

                        {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {post.tags.map((tag) => (
                                    <button
                                        key={tag}
                                        className="tag-badge cursor-pointer"
                                        aria-label={`Tag ${tag}`}
                                    >
                                        #{tag}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="border-t border-ink-soft px-3 py-2.5 flex items-center gap-1">
                <button
                    className={`action-btn${post.isLiked ? " liked" : ""}`}
                    onClick={() => toggleLikePost({ postId: post.id, isLiked: post.isLiked })}
                    aria-label="Like"
                >
                    <Heart size={16} fill={post.isLiked ? "currentColor" : "none"} />
                    <span>{fmt(post.likes)} reactions</span>
                </button>

                <Link to={`/posts/${post.id}#comments`} className="action-btn" aria-label="Comment">
                    <MessageCircle size={16} />
                    <span>{fmt(post.comments)} comments</span>
                </Link>

                <button
                    className="action-btn"
                    onClick={() => copy(`posts/${post.id}`)}
                    aria-label="Share"
                >
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
        </article>
    );
};
