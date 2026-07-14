import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Avatar, ErrorAlert, Preloader } from "@/components";
import { Link, useParams } from "react-router-dom";

export const TopAuthors = () => {
    const { tag } = useParams<{ tag: string }>();
    const {
        data: topUsers,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["weeklyTopUsers", tag],
        queryFn: () => apiClient.getWeeklyTopUsers(tag),
        staleTime: 60 * 60 * 1000,
    });

    if (topUsers?.length === 0) {
        return <p className="text-sm text-muted">No top users available</p>;
    }

    return (
        <div className="flex flex-col gap-2">
            {isLoading ? (
                <Preloader />
            ) : isError ? (
                <ErrorAlert message="Failed to fetch trending" />
            ) : (
                topUsers &&
                topUsers.map((user) => (
                    <div key={user.id} className="flex items-center gap-3">
                        <Avatar size="sm" handle={user.handle} link={`/profile/${user.handle}`} />

                        <div className="flex flex-col gap-0.5">
                            <Link
                                to={`/profile/${user.handle}`}
                                className="font-semibold hover:underline"
                            >
                                {user.username}
                            </Link>

                            <div className="flex items-center gap-1.5 flex-wrap text-[12px] leading-tight">
                                <span className="font-semibold text-subtle">
                                    {user.posts} posts
                                </span>
                                <span className="text-subtle">·</span>
                                <span className="font-semibold text-subtle">
                                    {user.followers} followers
                                </span>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );

    return (
        <div className="space-y-4">
            {[
                { name: "Андрюха", posts: 54 },
                { name: "Kate", posts: 41 },
                { name: "John", posts: 32 },
            ].map((author) => (
                <div key={author.name} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-ink bg-accent font-bold text-accent-fg">
                        {author.name[0]}
                    </div>

                    <div>
                        <p className="font-semibold">{author.name}</p>

                        <div className="flex items-center gap-1.5 flex-wrap text-[12px] leading-tight">
                            <span className="font-semibold text-subtle">{author.posts} posts</span>
                            <span className="text-subtle">·</span>
                            <span className="font-semibold text-subtle">~{author.posts} likes</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
