import { ErrorAlert, Preloader } from "@/components";
import { apiClient } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const TrendingList = () => {
    const {
        data: trendingPosts,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["exploreTrendingPosts"],
        queryFn: () => apiClient.getAllTrendingPosts(),
        staleTime: 10 * 60 * 1000,
    });

    return (
        <div className="flex flex-col gap-3">
            {isLoading ? (
                <Preloader />
            ) : isError ? (
                <ErrorAlert message="Failed to fetch trending" />
            ) : (
                trendingPosts &&
                trendingPosts.map((post) => (
                    <div key={post.id} className="flex flex-col gap-0.2 cursor-pointer text-muted">
                        <p className="text-text-base font-bold">{post.title}</p>
                        <p className="text-[13px]">Post ID: {post.id}</p>
                        <p className="text-[13px] mt-0.5">
                            Author:{" "}
                            <span className="font-semibold text-text-base">
                                {post.author.username}
                            </span>{" "}
                            · {post.likes} likes
                        </p>
                    </div>
                ))
            )}
        </div>
    );
};
