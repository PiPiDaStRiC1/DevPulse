import { useState } from "react";
import { Heart, MessageCircle, Repeat2, Bookmark, Share2, BadgeCheck } from "lucide-react";
import { Avatar, ErrorAlert } from "@/components";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { safeParseDate } from "@/lib/utils";
import type { Post } from "@shared/types";

interface PostCardProps {
    post: Post;
}

/* highlight #tags and @mentions in content */
function RichContent({ text }: { text: string }) {
    const paragraphs = text.split("\n\n").filter(Boolean);

    return (
        <div className="flex flex-col gap-2.5">
            {paragraphs.map((paragraph, pi) => {
                const lines = paragraph.split("\n");
                return (
                    <p
                        key={pi}
                        className={
                            pi === 0
                                ? "text-[1.58rem] leading-[1.18] font-extrabold tracking-[-0.02em] text-text-base"
                                : "text-[0.95rem] leading-[1.62] text-text-base"
                        }
                    >
                        {lines.map((line, li) => (
                            <span key={li}>
                                {line.split(/(\s+)/).map((token, ti) => {
                                    if (token.startsWith("#")) {
                                        return (
                                            <span
                                                key={ti}
                                                className="text-av-blue font-semibold cursor-pointer"
                                            >
                                                {token}
                                            </span>
                                        );
                                    }
                                    if (token.startsWith("@")) {
                                        return (
                                            <span
                                                key={ti}
                                                className="text-[#b45309] font-semibold cursor-pointer"
                                            >
                                                {token}
                                            </span>
                                        );
                                    }
                                    return token;
                                })}
                                {li < lines.length - 1 && <br />}
                            </span>
                        ))}
                    </p>
                );
            })}
        </div>
    );
}

export const PostCard = ({ post }: PostCardProps) => {
    const [liked, setLiked] = useState(post.isLiked!);
    const [bookmarked, setBookmarked] = useState(post.isBookmarked!);
    const [likeCount, setLikeCount] = useState(post.likes!);

    const {
        data: author,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["user", post.authorId],
        queryFn: apiClient.me, // Replace with actual API call to fetch user data by ID
        staleTime: 30 * 60 * 1000,
    });

    if (isError || !author) {
        return <ErrorAlert message="Failed to load author information" />;
    }

    const fmt = (n: number | undefined) => (n && n >= 1000 ? `${(n / 1000).toFixed(1)}k` : 0);

    const postDateLabel = safeParseDate(post.createdAt);

    return (
        <article className="card p-0 mb-4 overflow-hidden">
            <div className="p-4 sm:p-5">
                <div className="flex gap-3.5">
                    <Avatar handle={author.handle} size="sm" isLoading={isLoading} />

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap text-[12px] leading-tight">
                            <span className="font-semibold text-text-base">{author.username}</span>
                            {author.isVerified && (
                                <BadgeCheck size={13} className="text-av-blue shrink-0" />
                            )}
                            <span className="text-muted">{author.handle}</span>
                            <span className="text-subtle">·</span>
                            <span className="text-subtle">{postDateLabel}</span>
                            <span className="text-subtle">·</span>
                            <span className="text-subtle">{author.role}</span>
                            <span className="text-subtle">·</span>
                            <span className="text-subtle">~3 min read</span>
                        </div>

                        <div className="mt-2.5">
                            <RichContent text={post.content} />
                        </div>

                        {post.image === "gradient" && (
                            <div className="mt-4 h-[170px] border-2 border-ink rounded-[var(--radius)] bg-[#ece8dd] flex items-center justify-center text-muted text-[13px] font-medium">
                                📸 Dashboard redesign preview
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
                                        className="appearance-none border-0 bg-transparent p-0 text-[13px] font-semibold text-muted hover:text-text-base hover:underline hover:underline-offset-2 cursor-pointer"
                                        aria-label={`Tag ${tag}`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="border-t border-ink-soft px-3 py-2.5 flex items-center gap-1">
                <button
                    onClick={() => {
                        setLiked((v) => !v);
                        setLikeCount((c) => (liked ? c - 1 : c + 1));
                    }}
                    className={`action-btn${liked ? " liked" : ""}`}
                    aria-label="Like"
                >
                    <Heart size={16} fill={liked ? "currentColor" : "none"} />
                    <span>{fmt(likeCount)} reactions</span>
                </button>

                <button className="action-btn" aria-label="Comment">
                    <MessageCircle size={16} />
                    <span>{fmt(post.comments.length)} comments</span>
                </button>

                <button className="action-btn" aria-label="Repost">
                    <Repeat2 size={16} />
                    <span>{fmt(post.reposts)} reposts</span>
                </button>

                <button className="action-btn" aria-label="Share">
                    <Share2 size={16} />
                </button>

                <button
                    onClick={() => setBookmarked((v) => !v)}
                    className={`action-btn ml-auto${bookmarked ? " bookmarked" : ""}`}
                    aria-label="Bookmark"
                >
                    <Bookmark size={16} fill={bookmarked ? "currentColor" : "none"} />
                </button>
            </div>
        </article>
    );
};
