import { useEffect, useState } from "react";
import { ErrorAlert, Preloader, TopicsList, TrendingPostsList } from "@/components";
import { Search, Delete } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { SearchCard } from "@/components";

export const Explore = () => {
    const [uiQuery, setUiQuery] = useState("");
    const [query, setQuery] = useState("");
    const isSearching = uiQuery.trim() !== "";
    const {
        data: posts,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["exploreSummaryPosts", query],
        queryFn: () => apiClient.getAllSummaryPosts(query),
        enabled: isSearching,
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setQuery(uiQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [uiQuery]);

    return (
        <div className="flex-1 min-w-0 flex flex-col gap-3">
            <div className="flex flex-col">
                <div
                    className={`card flex items-center gap-3 px-4 py-3 ${uiQuery.trim() ? "!shadow-none !transform-none" : ""}`}
                >
                    <Search size={18} className="text-muted shrink-0" />
                    <input
                        type="text"
                        value={uiQuery}
                        onChange={(e) => setUiQuery(e.target.value)}
                        placeholder="Search posts, tags, people…"
                        className="flex-1 bg-transparent outline-none border-0 text-sm font-medium text-text-base placeholder:text-muted"
                    />
                    {uiQuery && (
                        <button
                            onClick={() => setUiQuery("")}
                            className="text-xs font-bold text-muted hover:text-text-base transition-colors bg-transparent border-0 cursor-pointer"
                        >
                            <Delete size={18} />
                        </button>
                    )}
                </div>
                {isSearching && (
                    <div className="card max-h-70 flex flex-col gap-0 overflow-auto">
                        {isLoading ? (
                            <Preloader />
                        ) : isError ? (
                            <ErrorAlert />
                        ) : posts && posts.length > 0 ? (
                            posts.map((post, index) => (
                                <SearchCard key={post.id} post={post} index={index + 1} />
                            ))
                        ) : (
                            <div className="flex items-center justify-center p-4">
                                <p className="text-muted">No posts found.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <TrendingPostsList />

            <TopicsList />
        </div>
    );
};
