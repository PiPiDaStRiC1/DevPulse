import { Avatar, FollowingSkeleton, ErrorAlert } from "@/components";
import { useFollowing } from "@/hooks";

export const FollowingList = () => {
    const {
        suggestedUsers,
        isErrorSuggested,
        isLoadingSuggested,
        isPendingFollowing,
        toggleFollowUser,
    } = useFollowing();

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
            {suggestedUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-2.5">
                    <Avatar link={`/profile/${user.handle}`} handle={user.handle} size="sm" />
                    <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold truncate">{user.username}</p>
                        <p className="text-[11px] text-muted truncate">@{user.handle}</p>
                    </div>
                    {isPendingFollowing ? (
                        <button type="button" className="btn-solid shrink-0 !py-1 !px-3 !text-xs">
                            Following...
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() =>
                                toggleFollowUser({ userId: user.id, isFollowing: user.isFollowing })
                            }
                            className={`${user.isFollowing ? "btn-outline" : "btn-solid"} shrink-0 !py-1 !px-3 !text-xs`}
                        >
                            {user.isFollowing ? "Following" : "Follow"}
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};
