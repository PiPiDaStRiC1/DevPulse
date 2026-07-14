import { ErrorAlert, Preloader } from "@/components/common";
import { apiClient } from "@/lib/api";
import { fmt } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export const TopPosts = () => {
    const { tag } = useParams<{ tag: string }>();
    const {
        data: topPosts,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["weeklyTopPosts", tag],
        queryFn: () => apiClient.getWeeklyTopPosts(tag),
        staleTime: 60 * 60 * 1000,
    });

    if (topPosts?.length === 0) {
        return <p className="text-sm text-muted">No top posts available</p>;
    }

    return (
        <div className="flex flex-col gap-2">
            {isLoading ? (
                <Preloader />
            ) : isError ? (
                <ErrorAlert message="Failed to fetch trending" />
            ) : (
                topPosts &&
                topPosts.map((post, index) => (
                    <Link
                        key={post.id}
                        to={`/posts/${post.id}`}
                        className="flex gap-3 text-sm hover:underline"
                    >
                        <span className="font-extrabold text-subtle">#{index + 1}</span>

                        <p className="flex justify-between w-full">
                            <span className="font-medium">{post.title}</span>
                            <span className="inline-flex items-center text-xs font-semibold text-muted">
                                {fmt(post.likes)}
                                <Heart size={12} className="inline-block ml-1 text-red-500" />
                            </span>
                        </p>
                    </Link>
                ))
            )}
        </div>
    );
};
