import { useInfiniteQuery } from "@tanstack/react-query";
import { ErrorAlert, TopicCard, TopicCardSkeleton } from "@/components";
import { ArrowDownRight, Flame } from "lucide-react";
import { apiClient } from "@/lib/api";

const TOPICS_PER_PAGE = 5;

export const TopicsList = () => {
    const { data, isLoading, isError, isFetchingNextPage, fetchNextPage, hasNextPage } =
        useInfiniteQuery({
            queryKey: ["exploreTopics"],
            queryFn: async ({ pageParam }) => {
                const data = await apiClient.getAllTopics(TOPICS_PER_PAGE, pageParam);

                return data;
            },
            initialPageParam: 0,
            getNextPageParam: (lastPage, allPages) => {
                if (lastPage.hasMore) {
                    return allPages.length * TOPICS_PER_PAGE;
                }

                return null;
            },
            staleTime: 10 * 60 * 1000,
        });

    const allTopics = data?.pages.flatMap((page) => page.data);

    return (
        <div className="flex gap-5 items-start">
            <div className="flex-1 min-w-0 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <Flame size={15} className="text-ink shrink-0" />
                    <h2 className="text-sm font-bold tracking-tight">All Topics</h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {isLoading ? (
                        Array.from({ length: 8 }).map((_, i) => <TopicCardSkeleton key={i} />)
                    ) : isError ? (
                        <ErrorAlert />
                    ) : (
                        allTopics &&
                        allTopics.map((topic) => {
                            return <TopicCard key={topic.id} topicTag={topic} />;
                        })
                    )}
                    {!isError && !isLoading && hasNextPage && (
                        <button
                            onClick={() => fetchNextPage()}
                            className="card p-4 text-left cursor-pointer group bg-surface"
                        >
                            <div className="w-8 h-8 rounded-[var(--radius)] bg-ink mb-3 border-2 border-ink flex items-center justify-center">
                                {isFetchingNextPage ? (
                                    <div className="bg-ink relative">
                                        <div className="w-5 h-5 border-2 border-t-white rounded-full animate-spin" />
                                    </div>
                                ) : (
                                    <ArrowDownRight size={13} className="text-white" />
                                )}
                            </div>
                            <p className="text-[13px] font-bold text-text-base group-hover:underline">
                                {isFetchingNextPage ? "Loading..." : "Load more"}
                            </p>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
