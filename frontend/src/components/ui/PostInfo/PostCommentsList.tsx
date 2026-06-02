import { PostComment, ErrorAlert, PostCommentSkeleton } from "@/components";
import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Comment, Post } from "@shared/types";
import { useState } from "react";
import toast from "react-hot-toast";

interface PostCommentsListProps {
    post: Post;
}

export const PostCommentsList = ({ post }: PostCommentsListProps) => {
    const queryClient = useQueryClient();
    const [body, setBody] = useState("");
    const { status } = useAuthStore();

    const {
        data: comments,
        isLoading,
        isError,
    } = useQuery<Comment[]>({
        queryKey: ["posts", post.id, "comments"],
        queryFn: () => apiClient.getAllCommentsByPostId(post.id),
        enabled: !!post.id,
        staleTime: 5 * 60 * 1000,
    });

    const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const newComment = await apiClient.postComment({ postId: post.id, text: body });

            queryClient.setQueryData(
                ["posts", post.id, "comments"],
                (oldData: Comment[] | undefined) => {
                    if (!oldData) return [newComment];
                    return [...oldData, newComment];
                },
            );
            setBody("");
        } catch (error) {
            console.error("Failed to create post", error);
            if (error instanceof Error) {
                toast.error(error.message || "Failed to create post");
            }
        }
    };

    return (
        <section className="border-t border-ink-soft pt-6">
            <div className="card p-4 sm:p-5 mb-5">
                <div className="flex gap-3">
                    <form className="flex-1 min-w-0" onSubmit={handleCommentSubmit}>
                        <textarea
                            value={body}
                            className="w-full min-h-28 resize-y rounded-md border-2 border-ink bg-surface px-3 py-2 text-sm text-text-base outline-none focus:ring-0"
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Write a comment..."
                        />
                        <div className="mt-3 flex items-center justify-between gap-3">
                            <p className="text-xs text-subtle">Markdown and links are supported.</p>
                            {status === "authenticated" ? (
                                <button
                                    type="submit"
                                    className="btn-solid !py-2 !px-4 !text-sm"
                                    disabled={!body.trim()}
                                >
                                    Publish
                                </button>
                            ) : (
                                <button type="button" className="btn-outline !py-2 !px-4 !text-sm">
                                    Sign in to comment
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            <div className="space-y-4">
                {isError ? (
                    <ErrorAlert message="Failed to load comments. Please try again later." />
                ) : isLoading ? (
                    <div className="space-y-3">
                        <PostCommentSkeleton />
                        <PostCommentSkeleton />
                    </div>
                ) : !comments || comments.length === 0 ? (
                    <div className="text-center rounded-md border-2 border-dashed border-ink-soft bg-bg px-4 py-6 text-sm text-subtle">
                        No comments yet
                    </div>
                ) : (
                    comments.map((comment) => <PostComment key={comment.id} comment={comment} />)
                )}
            </div>
        </section>
    );
};
