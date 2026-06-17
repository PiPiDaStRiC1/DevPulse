export const CollectionList = () => {
    return (
        <aside className="w-70 space-y-5">
            <div className="sticky top-20 card p-5">
                <div className="text-sm font-semibold mb-3">Collections</div>
                <div className="space-y-3">
                    {[
                        { name: "Design patterns", count: 7, tone: "bg-av-teal/10" },
                        { name: "API references", count: 9, tone: "bg-av-blue/10" },
                        { name: "Need to revisit", count: 4, tone: "bg-av-orange/10" },
                    ].map((item) => (
                        <div
                            key={item.name}
                            className="flex items-center justify-between gap-3 rounded-md border border-ink-soft bg-bg px-3 py-3"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <span className={`w-3 h-3 rounded-full ${item.tone}`} />
                                <span className="text-sm font-medium truncate">{item.name}</span>
                            </div>
                            <span className="text-xs text-subtle">{item.count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
};
