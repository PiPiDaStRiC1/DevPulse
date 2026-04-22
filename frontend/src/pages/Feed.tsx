import { useState } from "react";
import { trendingTopics, suggestedUsers } from "@/lib/constants";
import { CreatePostBox, PostCard, RightPanel } from "@/components/ui";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { ErrorAlert, PostSkeleton } from "@/components";

const feedTabs = ["For You", "Following", "Trending"] as const;

export const Feed = () => {
    const [activeTab, setActiveTab] = useState<(typeof feedTabs)[number]>("For You");
    const {
        data: posts,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["feed", activeTab],
        queryFn: apiClient.getAllPosts,
        staleTime: 1 * 60 * 1000,
    });

    if (isError || !posts) {
        return <ErrorAlert message="Failed to load feed" />;
    }

    return (
        <>
            <div className="min-w-0 flex-1 flex flex-col self-start">
                <div className="filter-card flex mb-4 overflow-hidden">
                    {feedTabs.map((tab) => {
                        const isActive = tab === activeTab;
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 text-[13px] font-bold font-[inherit] border-0 bg-transparent cursor-pointer transition-colors duration-150 border-b-[2.5px] ${isActive ? "border-ink text-text-base" : "border-transparent text-muted"}`}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>

                <div className="flex flex-col gap-5">
                    <CreatePostBox />
                    {isLoading
                        ? Array.from({ length: 5 }).map((_, i) => <PostSkeleton key={i} />)
                        : posts.map((post) => <PostCard key={post.id} post={post} />)}
                </div>
            </div>

            <RightPanel trending={trendingTopics} suggested={suggestedUsers} />
        </>
    );
};
