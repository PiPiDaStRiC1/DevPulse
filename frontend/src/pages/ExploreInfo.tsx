import { ErrorAlert, PostSkeleton, TinyPostCard } from "@/components";
import { apiClient } from "@/lib/api";
import { fmt, safeParseDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Flame, Hash } from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom";

const exploreFilters = [
    { name: "Trending", value: "trending" },
    { name: "Newest", value: "newest" },
] as const;

type ExploreFilter = (typeof exploreFilters)[number]["value"];

export const ExploreInfo = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeFilter = (searchParams.get("sort") as ExploreFilter) || "trending";
    const { tag } = useParams<{ tag: string }>();
    const { data: topic, isLoading: isLoadingTopic } = useQuery({
        queryKey: ["exploreTopics", tag],
        queryFn: () => apiClient.getOneTopicBySlug(tag!),
        staleTime: 5 * 60 * 1000,
        enabled: !!tag,
    });

    const {
        data: posts,
        isLoading: isLoadingPosts,
        isError: isErrorPosts,
    } = useQuery({
        queryKey: ["posts", tag, activeFilter],
        queryFn: () => apiClient.getAllPosts({ sort: activeFilter, tag }),
        staleTime: 5 * 60 * 1000,
    });

    const toggleSearchParam = (param: ExploreFilter) => {
        setSearchParams((prev) => {
            if (param === "trending") {
                prev.delete("sort");
            } else {
                prev.set("sort", param);
            }

            return prev;
        });
    };

    return (
        <div className="min-w-0 flex-1 flex flex-col gap-5">
            <section className="card flex justify-between items-center p-6">
                <div className="flex items-start justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="flex p-4 items-center justify-center rounded-md border-2 border-ink shadow-[2px_2px_0_var(--ink)]">
                            <Hash size={25} />
                        </div>

                        <div>
                            <h1 className="text-[20px] sm:text-[23px] font-extrabold tracking-[-0.03em] text-text-base">
                                {tag}
                            </h1>

                            {isLoadingTopic ? (
                                <div className="flex flex-col gap-2">
                                    <p className="h-3 w-10 bg-ink-soft animate-pulse"></p>
                                    <p className="h-3 w-25 bg-ink-soft animate-pulse"></p>
                                </div>
                            ) : (
                                <>
                                    <p className="text-subtle">{fmt(topic?.postsCount)} post(s)</p>
                                    <p className="text-subtle">
                                        Created at: {safeParseDate(topic?.createdAt)}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    {exploreFilters.map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => toggleSearchParam(filter.value)}
                            className={`cursor-pointer rounded-md border-2 border-ink px-4 py-2 font-bold ${
                                activeFilter === filter.value
                                    ? "bg-accent text-accent-fg"
                                    : "bg-bg text-text-base"
                            }`}
                        >
                            {filter.name}
                        </button>
                    ))}
                </div>
            </section>

            <div className="grid grid-cols-[1fr_320px] gap-6">
                <section>
                    <div className="mb-4 flex items-center gap-2">
                        <Flame size={18} />
                        <h2 className="text-text-base font-extrabold">Posts about #{tag}</h2>
                    </div>

                    <div className="space-y-4">
                        {isLoadingPosts ? (
                            Array.from({ length: 5 }).map((_, i) => <PostSkeleton key={i} />)
                        ) : isErrorPosts ? (
                            <ErrorAlert message="Failed to load feed" />
                        ) : !posts || posts.length === 0 ? (
                            <div className="text-center rounded-md border-2 border-dashed border-ink-soft bg-bg px-4 py-6 text-sm text-text-base">
                                No posts available
                            </div>
                        ) : (
                            posts.map((post) => <TinyPostCard key={post.id} post={post} />)
                        )}
                    </div>
                </section>

                <aside className="space-y-4">
                    <div className="card p-4">
                        <h3 className="mb-4 font-extrabold">Top Authors</h3>

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

                                        <p className="text-xs text-subtle">{author.posts} posts</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card p-4">
                        <h3 className="mb-4 font-extrabold">Top This Week</h3>

                        <div className="space-y-3">
                            {[
                                "React Compiler Deep Dive",
                                "React Server Components",
                                "State Management in 2025",
                                "Advanced Suspense Patterns",
                            ].map((title, index) => (
                                <div key={title} className="flex gap-3 text-sm">
                                    <span className="font-extrabold text-subtle">#{index + 1}</span>

                                    <span className="font-medium">{title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};
