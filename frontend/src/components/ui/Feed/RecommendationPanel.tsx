import { Users } from "lucide-react";
import { FollowingList, TrendingList } from "@/components";

export const RecommendationPanel = () => {
    return (
        <aside className="w-70 sticky top-16 shrink-0 flex flex-col gap-4">
            <div className="card flex flex-col gap-2 p-4">
                <div className="flex items-center gap-2">
                    <Users size={15} className="text-ink shrink-0" />
                    <h2 className="text-sm font-bold tracking-tight">People to Follow</h2>
                </div>
                <FollowingList />
            </div>

            <div className="card p-4">
                <h3 className="text-sm font-bold mb-3.5 tracking-[0.01em]">Trending</h3>
                <TrendingList />
            </div>
        </aside>
    );
};
