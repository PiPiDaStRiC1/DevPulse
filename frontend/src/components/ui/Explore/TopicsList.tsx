import { useQuery } from "@tanstack/react-query";
import { ErrorAlert, TopicCard, TopicCardSkeleton } from "@/components";
import { Flame } from "lucide-react";
import { apiClient } from "@/lib/api";

export const TopicsList = () => {
    const {
        data: topics,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["exploreTopics"],
        queryFn: apiClient.getAllTopics,
        staleTime: 5 * 60 * 1000,
    });

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
                        topics &&
                        topics.map((topic) => <TopicCard key={topic.id} topicTag={topic} />)
                    )}
                    <button
                        className="disabled:opacity-50 disabled:!cursor-not-allowed max-w-40 justify-self-center sm:col-start-2 lg:col-start-2 col-span-2 sm:col-span-1 lg:col-span-2 btn-outline inline-flex items-center justify-center gap-2 !text-sm"
                        aria-label="Load more topics"
                        disabled={isLoading || isError}
                    >
                        Load more
                    </button>
                </div>
            </div>
        </div>
    );
};
