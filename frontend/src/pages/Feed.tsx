import { useEffect } from "react";
import { CreatePostBox, PostCard, RecommendationPanel } from "@/components";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { ErrorAlert, PostSkeleton } from "@/components";
import { socket } from "@/lib/store";
import { useSearchParams } from "react-router-dom";

type FeedTab = (typeof feedTabs)[number]["value"];

const feedTabs = [
    { name: "For You", value: "for-you" },
    { name: "Following", value: "following" },
    { name: "Trending", value: "trending" },
] as const;

export const Feed = () => {
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = (searchParams.get("tab") as FeedTab) || "for-you";
    const {
        data: posts,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["posts", activeTab],
        queryFn: () => apiClient.getAllPosts({ filter: activeTab }),
        staleTime: 1 * 60 * 1000,
    });

    const handleChangeTab = (tab: FeedTab) => {
        setSearchParams((prev) => {
            if (tab === "for-you") {
                prev.delete("tab");
            } else {
                prev.set("tab", tab);
            }
            return prev;
        });
    };

    useEffect(() => {
        const handler = () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        };

        socket.on("post:publish:new", handler);
        return () => {
            socket.off("post:publish:new", handler);
        };
    }, [queryClient]);

    if (isError) {
        return <ErrorAlert message="Failed to load feed" onRetry={refetch} />;
    }

    return (
        <>
            <div className="min-w-0 flex-1 flex flex-col self-start">
                <div className="filter-card flex mb-4 overflow-hidden">
                    {feedTabs.map((tab) => {
                        const isActive = tab.value === activeTab;
                        return (
                            <button
                                key={tab.value}
                                onClick={() => handleChangeTab(tab.value)}
                                className={`flex-1 text-[13px] font-bold font-[inherit] border-0 bg-transparent cursor-pointer transition-colors duration-150 border-b-[2.5px] ${isActive ? "border-ink text-text-base" : "border-transparent text-muted"}`}
                            >
                                {tab.name}
                            </button>
                        );
                    })}
                </div>

                <div className="flex flex-col gap-5">
                    <CreatePostBox />
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => <PostSkeleton key={i} />)
                    ) : !posts || posts.length === 0 ? (
                        <div className="text-center rounded-md border-2 border-dashed border-ink-soft bg-bg px-4 py-6 text-sm text-text-base">
                            No posts available
                        </div>
                    ) : (
                        posts.map((post) => <PostCard key={post.id} post={post} />)
                    )}
                </div>
            </div>

            <RecommendationPanel />
        </>
    );
};
