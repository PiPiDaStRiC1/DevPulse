import { TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ErrorAlert, TrendingPostCard, TrendingPostCardSkeleton } from "@/components";
import { apiClient } from "@/lib/api";

export const TrendingPostsList = () => {
    const {
        data: trendingPosts,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["trendingPosts"],
        queryFn: apiClient.getAllTrendingPosts,
        staleTime: 10 * 60 * 1000,
    });

    return (
        <div className="flex gap-5 items-start">
            <div className="flex-1 min-w-0 flex flex-col gap-3">
                <div className="flex items-center gap-2 mt-1">
                    <TrendingUp size={15} className="text-ink shrink-0" />
                    <h2 className="text-sm font-bold tracking-tight">More Trending Posts</h2>
                </div>

                <div className="card overflow-hidden">
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                            <TrendingPostCardSkeleton key={index} />
                        ))
                    ) : isError ? (
                        <ErrorAlert />
                    ) : (
                        trendingPosts &&
                        trendingPosts.map((trendingPost, index) => (
                            <TrendingPostCard
                                key={trendingPost.id}
                                trendingPost={trendingPost}
                                index={index + 1}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
