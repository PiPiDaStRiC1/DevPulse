import { useState } from "react";
import { Heart, MessageCircle, Repeat2, Bookmark, Share2, BadgeCheck } from "lucide-react";
import type { Post } from "@/types";
import { Avatar } from "@/components/common";

/* highlight #tags and @mentions in content */
function RichContent({ text }: { text: string }) {
    const lines = text.split("\n");
    return (
        <p className="text-[15px] leading-[1.55] text-text-base">
            {lines.map((line, li) => (
                <span key={li}>
                    {line.split(/(\s+)/).map((token, ti) => {
                        if (token.startsWith("#"))
                            return (
                                <span
                                    key={ti}
                                    className="text-av-blue font-semibold cursor-pointer"
                                >
                                    {token}
                                </span>
                            );
                        if (token.startsWith("@"))
                            return (
                                <span
                                    key={ti}
                                    className="text-[#b45309] font-semibold cursor-pointer"
                                >
                                    {token}
                                </span>
                            );
                        return token;
                    })}
                    {li < lines.length - 1 && <br />}
                </span>
            ))}
        </p>
    );
}

export const PostCard = ({ post }: { post: Post }) => {
    const [liked, setLiked] = useState(post.isLiked);
    const [bookmarked, setBookmarked] = useState(post.isBookmarked);
    const [likeCount, setLikeCount] = useState(post.likes);

    const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

    return (
        <article className="card p-4 mb-4">
            <div className="flex gap-3.5">
                <Avatar user={post.author} size="md" />

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                        <span className="font-bold text-[15px]">{post.author.username}</span>
                        {post.author.isVerified && (
                            <BadgeCheck size={15} className="text-av-blue shrink-0" />
                        )}
                        <span className="text-muted text-sm">@{post.author.handle}</span>
                        <span className="text-subtle text-sm">·</span>
                        <span className="text-subtle text-sm">{post.createdAt}</span>
                        <span className="ml-auto text-[12px] font-semibold px-2.5 py-0.5 border border-ink-soft rounded-full text-muted bg-bg whitespace-nowrap">
                            {post.author.role}
                        </span>
                    </div>

                    <RichContent text={post.content} />

                    {post.image === "gradient" && (
                        <div className="mt-3 h-[140px] border-2 border-ink rounded-[var(--radius)] bg-[#f8f8f8] flex items-center justify-center text-muted text-[13px] font-medium">
                            📸 Dashboard redesign preview
                        </div>
                    )}

                    {post.codeSnippet && (
                        <div className="code-block mt-3 px-4 py-3.5">
                            <div className="flex items-center gap-2 mb-2">
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

                    {post.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                            {post.techStack.map((t) => (
                                <span key={t} className="tag-badge">
                                    {t}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center gap-1 mt-3.5 -ml-2">
                        <button
                            onClick={() => {
                                setLiked((v) => !v);
                                setLikeCount((c) => (liked ? c - 1 : c + 1));
                            }}
                            className={`action-btn${liked ? " liked" : ""}`}
                            aria-label="Like"
                        >
                            <Heart size={16} fill={liked ? "currentColor" : "none"} />
                            <span>{fmt(likeCount)}</span>
                        </button>

                        <button className="action-btn" aria-label="Comment">
                            <MessageCircle size={16} />
                            <span>{fmt(post.comments)}</span>
                        </button>

                        <button className="action-btn" aria-label="Repost">
                            <Repeat2 size={16} />
                            <span>{fmt(post.reposts)}</span>
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
                </div>
            </div>
        </article>
    );
};
