import { useState } from "react";
import { Users } from "lucide-react";
import type { SuggestedUser, TrendingTopic } from "@shared/types";
import { Avatar } from "@/components/common/Avatar";

interface RightPanelProps {
    trending: TrendingTopic[];
    suggested: SuggestedUser[];
}

export const RightPanel = ({ trending, suggested }: RightPanelProps) => {
    const [followed, setFollowed] = useState<Set<number>>(new Set());

    const toggleFollow = (id: number) => {
        setFollowed((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    return (
        <aside className="max-w-[300px] sticky top-16 shrink-0 flex flex-col gap-4">
            <div className="card flex flex-col gap-2 p-4">
                <div className="flex items-center gap-2">
                    <Users size={15} className="text-ink shrink-0" />
                    <h2 className="text-sm font-bold tracking-tight">People to Follow</h2>
                </div>
                <div className="flex flex-col gap-3">
                    {suggested.map((user) => {
                        const isFollowed = followed.has(user.id);
                        return (
                            <div key={user.id} className="flex items-center gap-2.5">
                                <Avatar handle={user.handle} size="sm" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-bold truncate">
                                        {user.username}
                                    </p>
                                    <p className="text-[11px] text-muted truncate">
                                        @{user.handle}
                                    </p>
                                </div>
                                <button
                                    onClick={() => toggleFollow(user.id)}
                                    className={`${isFollowed ? "btn-outline" : "btn-solid"} shrink-0 !py-1 !px-3 !text-xs`}
                                >
                                    {isFollowed ? "Following" : "Follow"}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="card p-4">
                <h3 className="text-sm font-bold mb-3.5 tracking-[0.01em]">Trending</h3>
                <div className="flex flex-col gap-3">
                    {trending.map((topic) => (
                        <div key={topic.id} className="cursor-pointer">
                            <p className="text-[13px] font-bold">#{topic.tag}</p>
                            <p className="text-[11px] text-muted mt-0.5">
                                {topic.posts.toLocaleString()} echoes · {topic.category}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
};
