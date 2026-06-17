import { useQuery } from "@tanstack/react-query";
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
        queryFn: () => Promise.resolve([]),
        enabled: !!post.id,
        staleTime: 0,
    });

    return (
        <aside className="hidden lg:block sticky top-20 shrink-0 w-72">
            <div className="card p-4">
                <div className="text-sm font-semibold mb-2">Related posts</div>
                {isLoading ? (
                    <div className="text-subtle text-sm">Loading related posts...</div>
                ) : isError ? (
                    <div className="text-subtle text-sm">Error loading related posts.</div>
                ) : relatedPosts && relatedPosts.length > 0 ? (
                    <div className="text-subtle text-sm">
                        Relevant posts will appear here later.
                    </div>
                ) : null}
            </div>
        </aside>
    );
};
