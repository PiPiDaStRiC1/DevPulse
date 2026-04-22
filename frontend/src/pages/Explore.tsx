import { useState } from "react";
import { Search, TrendingUp, Hash, Flame } from "lucide-react";
import { trendingTopics } from "@/lib/constants";

const categories = [
    "All",
    "Frontend",
    "Backend",
    "DevOps",
    "AI/ML",
    "Design",
    "Open Source",
] as const;
type Category = (typeof categories)[number];

const featuredTopics = [
    { tag: "TypeScript", posts: 12400, color: "#3178c6" },
    { tag: "React", posts: 18200, color: "#61dafb" },
    { tag: "Rust", posts: 4300, color: "#b45309" },
    { tag: "Docker", posts: 9100, color: "#0369a1" },
    { tag: "NextJS", posts: 11600, color: "#0f0f0f" },
    { tag: "Tailwind", posts: 7800, color: "#0d9488" },
    { tag: "AI", posts: 21000, color: "#be185d" },
    { tag: "Figma", posts: 5200, color: "#15803d" },
];

const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

export const Explore = () => {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState<Category>("All");

    return (
        <div className="flex-1 min-w-0 flex flex-col gap-5">
            <div className="card flex items-center gap-3 px-4 py-3">
                <Search size={16} className="text-muted shrink-0" />
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
                        Clear
                    </button>
                )}
            </div>

            <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={[
                            "text-xs font-bold px-3 py-1.5 border-2 border-ink rounded-[var(--radius)]",
                            "cursor-pointer font-[inherit] transition-all duration-100",
                            category === cat
                                ? "bg-ink text-white"
                                : "bg-surface text-muted hover:text-text-base hover:border-ink",
                        ].join(" ")}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="flex gap-5 items-start">
                <div className="flex-1 min-w-0 flex flex-col gap-5">
                    <div className="flex items-center gap-2">
                        <Flame size={15} className="text-ink shrink-0" />
                        <h2 className="text-sm font-bold tracking-tight">Trending Topics</h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {featuredTopics.map(({ tag, posts, color }) => (
                            <button
                                key={tag}
                                className="card p-4 text-left cursor-pointer group bg-surface"
                            >
                                <div
                                    className="w-8 h-8 rounded-[var(--radius)] mb-3 border-2 border-ink flex items-center justify-center"
                                    style={{ background: color, boxShadow: "2px 2px 0 var(--ink)" }}
                                >
                                    <Hash size={13} className="text-white" />
                                </div>
                                <p className="text-[13px] font-bold text-text-base group-hover:underline">
                                    {tag}
                                </p>
                                <p className="text-[11px] text-muted mt-0.5">{fmt(posts)} posts</p>
                            </button>
                        ))}
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
                </div>
            </div>
        </div>
    );
};
