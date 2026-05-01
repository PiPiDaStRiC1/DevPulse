export const ChatRoomSkeleton = () => {
    return (
        <div className="flex-1 flex flex-col bg-bg min-w-0">
            {/* Header */}
            <div className="px-5 py-3 border-b-2 border-ink bg-surface flex items-center gap-3 shrink-0">
                <div className="w-12 h-12 rounded-full bg-ink-soft animate-pulse" />
                <div className="flex-1 space-y-1.5">
                    <div className="h-4 w-32 bg-ink-soft rounded animate-pulse" />
                    <div className="h-3 w-24 bg-ink-soft rounded animate-pulse" />
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                        key={i}
                        className={`flex flex-col gap-1 ${i % 3 === 0 ? "items-end" : "items-start"}`}
                    >
                        <div
                            className={`max-w-[60%] h-10 rounded-[var(--radius)] animate-pulse ${
                                i % 3 === 0 ? "bg-ink" : "bg-surface border-2 border-ink"
                            }`}
                        />
                        <div className="h-2 w-12 bg-ink-soft rounded animate-pulse" />
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="px-4 py-3 border-t-2 border-ink bg-surface shrink-0 flex items-end gap-3">
                <div className="flex-1 h-10 bg-bg border-2 border-ink rounded-[var(--radius)] animate-pulse" />
                <div className="h-10 w-10 bg-ink rounded-[var(--radius)] animate-pulse" />
            </div>
        </div>
    );
};
