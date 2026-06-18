import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { RelatedPost, Preloader, ErrorAlert } from "@/components";
import type { Post } from "@shared/types";

interface RelatedPostsProps {
    post: Post;
}

export const RelatedPosts = ({ post }: RelatedPostsProps) => {
    const {
        data: relatedPosts,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["relatedPosts", post.id],
        queryFn: () => apiClient.getAllRelatedPostsByPostId(post.id),
        enabled: !!post.id,
        staleTime: 0,
    });

    return (
        <aside className="hidden lg:block sticky top-20 shrink-0 w-72">
            <div className="card p-4">
                <div className="text-sm font-semibold mb-2">Related posts</div>
                {isLoading ? (
                    <Preloader />
                ) : isError ? (
                    <ErrorAlert message="Error loading related posts." />
                ) : relatedPosts && relatedPosts.length > 0 ? (
                    <div className="space-y-3">
                        {relatedPosts.map((relatedPost) => (
                            <RelatedPost key={relatedPost.id} post={relatedPost} />
                        ))}
                    </div>
                ) : (
                    <div className="text-subtle text-sm">No related posts found.</div>
                )}
            </div>
        </aside>
    );
};
