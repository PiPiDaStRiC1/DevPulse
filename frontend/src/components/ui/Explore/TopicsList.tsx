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
        staleTime: 10 * 60 * 1000,
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
                        topics.map((topic, index) => {
                            const isLast = index === topics.length - 1;

                            return <TopicCard key={topic.id} topicTag={topic} isLast={isLast} />;
                        })
                    )}
                </div>
            </div>
        </div>
    );
};
