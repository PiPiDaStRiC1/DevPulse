export const PostSkeleton = () => {
    return (
        <div className="card w-full p-4 sm:p-5">
            <div className="h-8 w-40 rounded-[var(--radius)] bg-ink-soft/50" />
            <div className="mt-4 space-y-3">
                <div className="h-4 w-3/4 rounded-full bg-ink-soft/40" />
                <div className="h-4 w-full rounded-full bg-ink-soft/40" />
                <div className="h-4 w-5/6 rounded-full bg-ink-soft/40" />
            </div>
            <div className="mt-5 h-44 rounded-[var(--radius)] border-2 border-dashed border-ink-soft bg-bg/70" />
            <div className="mt-4 flex gap-2">
                <div className="h-7 w-16 rounded-full bg-ink-soft/40" />
                <div className="h-7 w-20 rounded-full bg-ink-soft/40" />
                <div className="h-7 w-18 rounded-full bg-ink-soft/40" />
            </div>
        </div>
    );
};
