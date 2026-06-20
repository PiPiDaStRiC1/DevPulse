import { useState } from "react";
import { TopicsList } from "@/components";
import { Search, TrendingUp, Delete } from "lucide-react";
import { fmt } from "@/lib/utils";
import { trendingTopics } from "@/lib/constants";

export const Explore = () => {
    const [query, setQuery] = useState("");

    return (
        <div className="flex-1 min-w-0 flex flex-col gap-5">
            <div className="card flex items-center gap-3 px-4 py-3">
                <Search size={18} className="text-muted shrink-0" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search posts, tags, people…"
                    className="flex-1 bg-transparent outline-none border-0 text-sm font-medium text-text-base placeholder:text-muted"
                />
                {query && (
                    <button
                        onClick={() => setQuery("")}
                        className="text-xs font-bold text-muted hover:text-text-base transition-colors bg-transparent border-0 cursor-pointer"
                    >
                        <Delete size={18} />
                    </button>
                )}
            </div>

            <div className="flex items-center gap-2 mt-1">
                <TrendingUp size={15} className="text-ink shrink-0" />
                <h2 className="text-sm font-bold tracking-tight">More Trending</h2>
            </div>

            <div className="card overflow-hidden">
                {trendingTopics.map((topic, i) => (
                    <div
                        key={topic.id}
                        className={[
                            "flex items-center justify-between px-4 py-3 cursor-pointer",
                            "hover:bg-bg transition-colors",
                            i < trendingTopics.length - 1 ? "border-b border-ink-soft" : "",
                        ].join(" ")}
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-[11px] font-bold text-subtle w-4 text-right">
                                {i + 1}
                            </span>
                            <div>
                                <p className="text-[13px] font-bold">#{topic.tag}</p>
                                <p className="text-[11px] text-muted">{topic.category}</p>
                            </div>
                        </div>
                        <span className="text-xs font-semibold text-muted">
                            {fmt(topic.posts)} posts
                        </span>
                    </div>
                ))}
            </div>

            <TopicsList />
        </div>
    );
};
