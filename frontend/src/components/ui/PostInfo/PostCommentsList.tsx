import { PostComment, ErrorAlert, PostCommentSkeleton } from "@/components";
import { useAuthStore } from "@/lib/store";
import { usePostComments } from "@/hooks";
import type { Post } from "@shared/types";

interface PostCommentsListProps {
    post: Post;
}

export const PostCommentsList = ({ post }: PostCommentsListProps) => {
    const { status } = useAuthStore();
    const { comments, isLoadingComments, isErrorComments, handleCommentSubmit, body, setBody } =
        usePostComments(post.id);

    return (
        <section id="comments" className="border-t border-ink-soft pt-6 scroll-mt-24">
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
                {isErrorComments ? (
                    <ErrorAlert message="Failed to load comments. Please try again later." />
                ) : isLoadingComments ? (
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
