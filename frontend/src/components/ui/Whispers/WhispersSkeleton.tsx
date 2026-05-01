export const WhispersSkeleton = () => {
    return (
        <div
            className="flex-1 h-[calc(100vh-10rem)] flex border-2 border-ink rounded-lg overflow-hidden"
            style={{ boxShadow: "var(--shadow-card)" }}
        >
            {/* Left Sidebar - Chats List */}
            <div className="w-80 shrink-0 border-r-2 border-ink bg-surface flex flex-col">
                {/* Header */}
                <div className="px-4 py-3 border-b-2 border-ink flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-ink-soft rounded-full" />
                        <div className="h-4 w-24 bg-ink-soft rounded animate-pulse" />
                    </div>
                    <div className="h-5 w-6 bg-ink-soft rounded-full animate-pulse" />
                </div>

                {/* Search Input */}
                <div className="px-3 py-2 border-b border-ink-soft">
                    <div className="flex items-center gap-2 bg-bg border border-ink-soft rounded-[var(--radius)] px-3 py-1.5">
                        <div className="w-3 h-3 bg-ink-soft rounded-full shrink-0" />
                        <div className="flex-1 h-3 bg-ink-soft rounded animate-pulse" />
                    </div>
                </div>

                {/* Chat Items List */}
                <div className="flex-1 overflow-y-auto space-y-0">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div
                            key={i}
                            className="w-full px-4 py-3 flex items-center gap-3 border-b border-ink-soft bg-surface hover:bg-bg transition-colors"
                        >
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full bg-ink-soft shrink-0 animate-pulse" />

                            {/* Chat info */}
                            <div className="flex-1 min-w-0 space-y-2">
                                <div className="flex items-center justify-between gap-1">
                                    <div className="h-3 w-24 bg-ink-soft rounded animate-pulse" />
                                    <div className="h-2 w-8 bg-ink-soft rounded animate-pulse" />
                                </div>
                                <div className="h-2.5 w-full bg-ink-soft rounded animate-pulse" />
                            </div>

                            {/* Unread badge */}
                            <div className="w-5 h-5 bg-ink rounded-full shrink-0 animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
