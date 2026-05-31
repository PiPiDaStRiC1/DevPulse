import { useState } from "react";
import { apiClient } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Avatar, ErrorAlert, PostSkeleton } from "@/components";
import { safeParseDate } from "@/lib/utils";
import { Heart, MessageCircle, Bookmark, ArrowLeft } from "lucide-react";
import { useTogglePostLike } from "@/hooks";
import type { Post } from "@shared/types";

export const PostInfo = () => {
    const { postId } = useParams<{ postId: string }>();
    const {
        data: post,
        isLoading,
        isError,
    } = useQuery<Post>({
        queryKey: ["posts", postId],
        queryFn: () => apiClient.getOnePost(Number(postId!)),
        enabled: !!postId,
        staleTime: 5 * 60 * 1000,
    });
    const { toggleLikePost, author, isLoadingAuthor } = useTogglePostLike(post?.authorId);

    const [bookmarked, setBookmarked] = useState(false);

    if (isLoading) return <PostSkeleton />;
    if (isError || !post) return <ErrorAlert message="Failed to load post" />;

    const dateLabel = safeParseDate(post.createdAt);

    return (
        <div className="min-w-7xl mx-auto">
            <div className="mb-4 px-1">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-sm font-medium text-subtle hover:text-text-base transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Feed
                </Link>
            </div>

            <article className="card p-6 sm:p-8">
                <header className="flex flex-col gap-4 mb-6">
                    <div className="preview-markdown">
                        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                            {post.title}
                        </ReactMarkdown>
                    </div>
                    <div className="flex gap-3 text-[13px] text-muted">
                        {author && (
                            <Link
                                to={`/profile/${author.handle ?? ""}`}
                                className="flex items-center gap-3"
                            >
                                <Avatar
                                    handle={author.handle}
                                    size="sm"
                                    isLoading={isLoadingAuthor}
                                />
                                <div className="min-w-0">
                                    <div className="font-semibold text-text-base">
                                        {author.username}
                                    </div>
                                    <div className="text-subtle">@{author.handle}</div>
                                </div>
                            </Link>
                        )}
                        <span className="text-subtle">{dateLabel}</span>
                        <span className="text-subtle">~{post.readTime} min read</span>
                    </div>
                </header>

                {post.coverImage && (
                    <div className="mb-6 border-2 border-ink rounded-lg overflow-hidden">
                        <img src={post.coverImage} alt="cover" className="w-full h-auto block" />
                    </div>
                )}

                <div className="flex justify-between gap-10">
                    <div className="preview-markdown">
                        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                            {post.content}
                        </ReactMarkdown>
                    </div>

                    <aside className="hidden lg:block w-72 shrink-0">
                        <div className="sticky top-20">
                            <div className="mb-4 text-sm text-subtle">Оглавление</div>
                            <nav className="space-y-1">
                                <div className="text-subtle">Нет заголовков</div>
                            </nav>
                        </div>
                    </aside>
                </div>

                <footer className="mt-8 border-t border-ink-soft pt-4 flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                        {post.tags.map((t) => (
                            <Link key={t} to={`/tag/${t}`} className="tag-badge">
                                #{t}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            className={`action-btn${post.isLiked ? " liked" : ""}`}
                            onClick={() =>
                                toggleLikePost({ postId: post.id, isLiked: post.isLiked })
                            }
                            aria-label="Like"
                        >
                            <Heart size={16} fill={post.isLiked ? "currentColor" : "none"} />
                            <span>{post.likes}</span>
                        </button>

                        <button className="action-btn" aria-label="Comment">
                            <MessageCircle size={16} />
                            <span>{post.comments.length}</span>
                        </button>

                        <button
                            onClick={() => setBookmarked((v) => !v)}
                            className={`action-btn ml-auto${bookmarked ? " bookmarked" : ""}`}
                            aria-label="Bookmark"
                        >
                            <Bookmark size={16} fill={bookmarked ? "currentColor" : "none"} />
                        </button>
                    </div>
                </footer>
            </article>

            <section className="mt-6">
                <div className="card p-4">
                    <div className="text-sm font-semibold mb-2">Похожие материалы</div>
                    <div className="text-subtle text-sm">Здесь позже будут релевантные посты.</div>
                </div>
            </section>
        </div>
    );
};
