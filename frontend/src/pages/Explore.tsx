import { useState } from "react";
import { TopicsList, TrendingPostsList } from "@/components";
import { Search, Delete } from "lucide-react";

export const Explore = () => {
    const [query, setQuery] = useState("");

    return (
        <div className="flex-1 min-w-0 flex flex-col gap-3">
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

            <TrendingPostsList />

            <TopicsList />
        </div>
    );
};
