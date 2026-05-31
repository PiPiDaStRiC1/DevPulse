import { PostComment } from "@/components";
import { useAuthStore } from "@/lib/store";
import type { Post } from "@shared/types";

interface PostCommentsListProps {
    post: Post;
}

export const PostCommentsList = ({ post }: PostCommentsListProps) => {
    const { status } = useAuthStore();

    return (
        <section className="border-t border-ink-soft pt-6">
            <div className="card p-4 sm:p-5 mb-5">
                <div className="flex gap-3">
                    <div className="flex-1 min-w-0">
                        <textarea
                            className="w-full min-h-28 resize-y rounded-md border-2 border-ink bg-surface px-3 py-2 text-sm text-text-base outline-none focus:ring-0"
                            placeholder="Write a comment..."
                        />
                        <div className="mt-3 flex items-center justify-between gap-3">
                            <p className="text-xs text-subtle">Markdown and links are supported.</p>
                            {status === "authenticated" ? (
                                <button className="btn-solid !py-2 !px-4 !text-sm">Publish</button>
                            ) : (
                                <button className="btn-outline !py-2 !px-4 !text-sm">
                                    Sign in to comment
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {post.comments.length === 0 ? (
                    <div className="text-center rounded-md border-2 border-dashed border-ink-soft bg-bg px-4 py-6 text-sm text-subtle">
                        No comments yet
                    </div>
                ) : (
                    post.comments.map((comment) => <PostComment comment={comment} />)
                )}
            </div>
        </section>
    );
};
