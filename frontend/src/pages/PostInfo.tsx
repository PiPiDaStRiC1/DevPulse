import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Avatar, ErrorAlert, PostSkeleton, PostCommentsList, RelatedPosts } from "@/components";
import { safeParseDate } from "@/lib/utils";
import { Heart, MessageCircle, Bookmark, ArrowLeft } from "lucide-react";
import { useTogglePostLike } from "@/hooks";
import type { Post } from "@shared/types";

export const PostInfo = () => {
    const { postId } = useParams<{ postId: string }>();
    const location = useLocation();
    const {
        data: post,
        isLoading,
        isError,
    } = useQuery<Post>({
        queryKey: ["posts", Number(postId)],
        queryFn: () => apiClient.getOnePost(Number(postId!)),
        enabled: !!postId,
        staleTime: 0,
    });
    const { toggleLikePost, author, isLoadingAuthor } = useTogglePostLike(post?.authorId);

    const [bookmarked, setBookmarked] = useState(false);

    useEffect(() => {
        if (isLoading || isError) return;

        if (location.hash === "#comments") {
            const commentsSection = document.getElementById("comments");
            commentsSection?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [isLoading, isError, location.hash]);

    if (isLoading) return <PostSkeleton />;
    if (isError || !post) return <ErrorAlert message="Failed to load post" />;

    return (
        <div className="min-w-full max-w-7xl">
            <div className="mb-4 px-1">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-sm font-medium text-subtle hover:text-text-base transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Feed
                </Link>
            </div>

            <div className="flex justify-between gap-10 items-start">
                <article className="card p-6 sm:p-8 min-w-0 flex-1">
                    <header className="flex flex-col gap-4 mb-6">
                        <div className="preview-markdown">
                            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                                {post.title}
                            </ReactMarkdown>
                        </div>
                        <div className="flex gap-3 text-[13px] text-muted">
                            {author && (
                                <div className="flex items-center gap-3">
                                    <Avatar
                                        handle={author.handle}
                                        size="sm"
                                        link={`/profile/${author.handle}`}
                                        isLoading={isLoadingAuthor}
                                    />
                                    <div className="min-w-0">
                                        <div className="font-semibold text-text-base">
                                            {author.username}
                                        </div>
                                        <div className="text-subtle">@{author.handle}</div>
                                    </div>
                                </div>
                            )}
                            <span className="text-subtle">{safeParseDate(post.createdAt)}</span>
                            <span className="text-subtle">~{post.readTime} min read</span>
                        </div>
                    </header>

                    {post.coverImage && (
                        <div className="mb-6 border-2 border-ink rounded-lg overflow-hidden">
                            <img
                                src={post.coverImage}
                                alt="cover"
                                className="w-full h-auto block"
                            />
                        </div>
                    )}

                    <div className="flex justify-between gap-10 min-w-0">
                        <div className="preview-markdown min-w-0 flex-1">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm, remarkBreaks]}
                                components={{
                                    pre: ({ children }) => (
                                        <pre className="max-w-full overflow-x-auto whitespace-pre rounded border-2 border-ink bg-[#f0ede3] px-4 py-3 shadow-[2px_2px_0_var(--ink)]">
                                            {children}
                                        </pre>
                                    ),
                                    code: ({ className, children, ...props }) => {
                                        const isBlockCode = !!className;

                                        return isBlockCode ? (
                                            <code
                                                className="block whitespace-pre min-w-max"
                                                {...props}
                                            >
                                                {children}
                                            </code>
                                        ) : (
                                            <code {...props}>{children}</code>
                                        );
                                    },
                                }}
                            >
                                {post.content}
                            </ReactMarkdown>
                        </div>

                        <aside className="hidden lg:block w-50 shrink-0">
                            <div className="sticky top-20">
                                <div className="mb-4 text-sm text-subtle">Table of Contents</div>
                                <nav className="space-y-1">
                                    <div className="text-subtle">No headings</div>
                                </nav>
                            </div>
                        </aside>
                    </div>

                    <footer className="mt-8 border-t border-ink-soft py-4 flex items-center justify-between">
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

                            <Link
                                to={`/posts/${post.id}#comments`}
                                className="action-btn"
                                aria-label="Comment"
                            >
                                <MessageCircle size={16} />
                                <span>{post.comments}</span>
                            </Link>

                            <button
                                onClick={() => setBookmarked((v) => !v)}
                                className={`action-btn ml-auto${bookmarked ? " bookmarked" : ""}`}
                                aria-label="Bookmark"
                            >
                                <Bookmark size={16} fill={bookmarked ? "currentColor" : "none"} />
                            </button>
                        </div>
                    </footer>
                    <PostCommentsList post={post} />
                </article>

                <RelatedPosts />
            </div>
        </div>
    );
};
