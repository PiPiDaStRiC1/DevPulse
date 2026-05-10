import { trendingTopics } from "@/lib/constants";

export const TrendingList = () => {
    return (
        <div className="flex flex-col gap-3">
            {trendingTopics.map((topic) => (
                <div key={topic.id} className="cursor-pointer">
                    <p className="text-[13px] font-bold">#{topic.tag}</p>
                    <p className="text-[11px] text-muted mt-0.5">
                        {topic.posts.toLocaleString()} echoes · {topic.category}
                    </p>
                </div>
            ))}
        </div>
    );
};
