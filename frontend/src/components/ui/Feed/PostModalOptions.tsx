export const PostModalOptions = () => {
    return (
        <div className="card p-4">
            <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.24em] text-muted">
                Publishing
            </div>
            <div className="space-y-3 text-[13px] text-text-base">
                <div className="flex items-center justify-between">
                    <span className="text-muted">Visibility</span>
                    <span className="font-semibold">Public</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-muted">Format</span>
                    <span className="font-semibold">Article</span>
                </div>
                <p className="pt-2 text-[12px] leading-relaxed text-muted">
                    Keep the main writing area dominant. The sidebar is only for context, preview,
                    and publishing state.
                </p>
            </div>
        </div>
    );
};
