import { useState } from "react";
import { Avatar, FollowingSkeleton } from "@/components";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { ErrorAlert } from "@/components/common";
import type { User } from "@shared/types";

export const FollowingList = () => {
    const {
        data: suggestedUsers,
        isLoading: isLoadingSuggested,
        isError: isErrorSuggested,
    } = useQuery<User[]>({
        queryKey: ["suggestedUsers"],
        queryFn: () => apiClient.getSuggestedUsers(),
        staleTime: 0,
    });
    const [followed, setFollowed] = useState<Set<number>>(new Set());

    const toggleFollow = (id: number) => {
        setFollowed((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    if (isErrorSuggested) {
        return <ErrorAlert message="Failed to load suggested users" />;
    }

    if (isLoadingSuggested || !suggestedUsers) {
        return <FollowingSkeleton />;
    }

    if (suggestedUsers.length === 0) {
        return <p className="text-sm text-muted">No suggestions available</p>;
    }

    return (
        <div className="flex flex-col gap-3">
            {suggestedUsers.map((user) => {
                const isFollowed = followed.has(user.id);
                return (
                    <div key={user.id} className="flex items-center gap-2.5">
                        <Avatar link={`/profile/${user.handle}`} handle={user.handle} size="sm" />
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-bold truncate">{user.username}</p>
                            <p className="text-[11px] text-muted truncate">@{user.handle}</p>
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
    );
};
