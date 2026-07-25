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
        <div className="flex flex-col gap-2">
            {isLoading ? (
                <Preloader />
            ) : isError ? (
                <ErrorAlert message="Failed to fetch trending" />
            ) : (
                trendingPosts &&
                trendingPosts.map((post) => (
                    <div
                        key={post.id}
                        className="group rounded-[var(--radius)] border-2 border-ink-soft bg-bg p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink hover:shadow-[var(--ink)]"
                    >
                        <p className="text-text-base font-bold">{post.title}</p>
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

