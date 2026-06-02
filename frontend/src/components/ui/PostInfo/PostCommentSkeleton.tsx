export const PostCommentSkeleton = () => {
    return (
        <div className="card p-4 sm:p-5 shadow-none hover:shadow-none animate-pulse">
            <div className="flex gap-3">
                <div className="w-10 h-10 rounded-md border-2 border-ink-soft bg-bg" />

                <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-28 rounded bg-ink-soft/60" />
                        <div className="h-3 w-16 rounded bg-ink-soft/60" />
                        <div className="h-3 w-20 rounded bg-ink-soft/60" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 w-full rounded bg-ink-soft/40" />
                        <div className="h-3 w-5/6 rounded bg-ink-soft/40" />
                    </div>
                </div>
            </div>
        </div>
    );
};
