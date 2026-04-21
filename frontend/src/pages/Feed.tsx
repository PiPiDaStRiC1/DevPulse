import { useState } from "react";
import { mockPosts, suggestedUsers, trendingTopics } from "@/lib/constants/mockData";
import { CreatePostBox, PostCard, RightPanel } from "@/components/ui";

const feedTabs = ["For You", "Following", "Trending"] as const;

export const Feed = () => {
    const [activeTab, setActiveTab] = useState<(typeof feedTabs)[number]>("For You");

    return (
        <>
            <div className="min-w-0">
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
                    {mockPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            </div>

            <RightPanel trending={trendingTopics} suggested={suggestedUsers} />
        </>
    );
};
