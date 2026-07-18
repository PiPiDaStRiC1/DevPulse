import { Layers3, Pencil, X } from "lucide-react";
import { useEffect } from "react";

type CollectionPost = {
    id: number;
    title: string;
    excerpt: string;
    authorName: string;
    authorHandle: string;
    tags: string[];
};

interface CollectionInfoProps {
    activeCollection: { name: string; note: string; count: number; posts: CollectionPost[] };
    closeModal: () => void;
    onEdit: () => void;
}

export const CollectionInfo = ({ closeModal, activeCollection, onEdit }: CollectionInfoProps) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                closeModal();
            }
        };

        window.document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.document.body.style.overflow = "auto";
        };
    });

    return (
        <div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(26,46,26,0.62)] px-4 py-4 backdrop-blur-[2px]"
            onMouseDown={closeModal}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={`${activeCollection.name} collection`}
                className="flex w-full max-w-3xl flex-col overflow-hidden rounded-[var(--radius)] border-2 border-ink bg-surface shadow-[10px_10px_0_var(--ink)]"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4 border-b-2 border-ink px-5 py-4">
                    <div className="min-w-0">
                        <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-muted">
                            <Layers3 size={13} />
                            Collection preview
                        </div>
                        <h3 className="text-xl font-extrabold tracking-tight text-text-base sm:text-2xl">
                            {activeCollection.name}
                        </h3>
                        <p className="mt-1 text-sm text-subtle">{activeCollection.note}</p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        <button
                            type="button"
                            onClick={onEdit}
                            aria-label="Edit collection"
                            className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-bg text-muted transition-colors hover:bg-ink hover:text-bg"
                        >
                            <Pencil size={15} />
                        </button>

                        <button
                            type="button"
                            onClick={closeModal}
                            aria-label="Close collection preview"
                            className="cursor-pointer flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-bg text-muted transition-colors hover:bg-ink hover:text-bg"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                <div className="grid gap-0 lg:grid-cols-[1.2fr,0.8fr]">
                    <div className="space-y-4 border-b-2 border-ink bg-bg/55 p-5 lg:border-b-0 lg:border-r-2">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-muted">
                                    Posts in collection
                                </div>
                                <div className="mt-1 text-sm text-subtle">
                                    A quick peek at what lives inside this set.
                                </div>
                            </div>
                            <span className="rounded-full border-2 border-ink-soft bg-surface px-3 py-1 text-[11px] font-bold text-muted">
                                {activeCollection.count} saved
                            </span>
                        </div>

                        <div className="space-y-3">
                            {activeCollection.posts.map((post, index) => (
                                <article
                                    key={post.id}
                                    className="group rounded-[var(--radius)] border-2 border-ink-soft bg-surface p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink hover:shadow-[var(--ink)]"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-ink-soft bg-bg text-[11px] font-black text-muted">
                                            {String(index + 1).padStart(2, "0")}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted">
                                                <span>{post.authorHandle}</span>
                                                <span>•</span>
                                                <span>{post.authorName}</span>
                                                <span>•</span>
                                                <span>Saved post</span>
                                            </div>

                                            <h4 className="mt-1 text-[15px] font-extrabold tracking-tight text-text-base line-clamp-2">
                                                {post.title}
                                            </h4>

                                            <p className="mt-2 text-[13px] leading-[1.6] text-subtle line-clamp-2">
                                                {post.excerpt}
                                            </p>

                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {post.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="tag-badge cursor-default"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
