import { useEffect } from "react";
import { apiClient } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams, Link, useNavigate } from "react-router-dom";
import {
    Avatar,
    ErrorAlert,
    PostSkeleton,
    PostCommentsList,
    RelatedPosts,
    HeadingTable,
    PostActions,
} from "@/components";
import { CustomReactMarkdown } from "@/features";
import { safeParseDate } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useTogglePostStats } from "@/hooks";
import type { Post } from "@shared/types";

export const PostInfo = () => {
    const navigate = useNavigate();
    const { postId } = useParams<{ postId: string }>();
    const location = useLocation();
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

    const { toggleLikePost, toggleBookmarkPost, author, isLoadingAuthor } = useTogglePostStats(
        post?.authorId,
    );

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
                <button
                    className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-subtle hover:text-text-base transition-colors"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
            </div>

            <div className="flex justify-between gap-5 items-start">
                <article className="card p-6 sm:p-8 min-w-0 flex-1">
                    <header className="flex flex-col gap-4 mb-6">
                        <div className="preview-markdown">
                            <h1>{post.title}</h1>
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
                            <CustomReactMarkdown content={post.content} />
                        </div>

                        <HeadingTable content={post.content} />
                    </div>

                    <footer className="mt-8 border-t border-ink-soft py-4 flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((t) => (
                                <Link key={t} to={`/tag/${t}`} className="tag-badge">
                                    #{t}
                                </Link>
                            ))}
                        </div>
                        <PostActions
                            post={post}
                            toggleLikePost={toggleLikePost}
                            toggleBookmarkPost={toggleBookmarkPost}
                        />
                    </footer>
                    <PostCommentsList post={post} />
                </article>

                <RelatedPosts post={post} />
            </div>
        </div>
    );
};
