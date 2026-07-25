import { Layers3, Pencil, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

type CollectionEditorModalProps = {
    initialValue?: { name: string; note: string } | undefined;
    mode: "create" | "edit";
    onClose: () => void;
    onSave: (draft: { name: string; note: string }) => void;
};

export const CollectionEditorModal = ({
    initialValue,
    mode,
    onClose,
    onSave,
}: CollectionEditorModalProps) => {
    const [name, setName] = useState(initialValue?.name ?? "");
    const [note, setNote] = useState(initialValue?.note ?? "");

    const isCreateMode = mode === "create";

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        const previousOverflow = window.document.body.style.overflow;
        window.document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-[85] flex items-center justify-center bg-[rgba(26,46,26,0.62)] px-4 py-4 backdrop-blur-[2px]"
            onMouseDown={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={isCreateMode ? "Create collection" : "Edit collection"}
                className="flex w-full max-w-xl flex-col overflow-hidden rounded-[var(--radius)] border-2 border-ink bg-surface shadow-[10px_10px_0_var(--ink)]"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4 border-b-2 border-ink px-5 py-4">
                    <div className="min-w-0">
                        <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-muted">
                            <Layers3 size={13} />
                            {isCreateMode ? "New collection" : "Edit collection"}
                        </div>
                        <h3 className="text-xl font-extrabold tracking-tight text-text-base sm:text-2xl">
                            {isCreateMode
                                ? "Build a new collection of bookmarks"
                                : "Refine the collection details"}
                        </h3>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close collection form"
                        className="cursor-pointer flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-bg text-muted transition-colors hover:bg-ink hover:text-bg"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="space-y-4 bg-bg/55 p-5">
                    <label className="block space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-muted">
                            Collection name
                        </span>
                        <input
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="For example, Design patterns"
                            className="w-full rounded-[var(--radius)] border-2 border-ink-soft bg-surface px-4 py-3 text-[14px] font-medium text-text-base outline-none transition-colors placeholder:text-subtle focus:border-ink"
                        />
                    </label>

                    <label className="block space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-muted">
                            Description
                        </span>
                        <textarea
                            value={note}
                            onChange={(event) => setNote(event.target.value)}
                            placeholder="A short note about what lives inside this collection"
                            rows={5}
                            className="min-h-[120px] w-full resize-none rounded-[var(--radius)] border-2 border-ink-soft bg-surface px-4 py-3 text-[14px] font-medium text-text-base outline-none transition-colors placeholder:text-subtle focus:border-ink"
                        />
                    </label>
                </div>

                <div className="flex flex-col gap-3 border-t-2 border-ink bg-surface px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => onSave({ name: name.trim(), note: note.trim() })}
                            disabled={!name.trim() || !note.trim()}
                            className="cursor-pointer btn-solid justify-center disabled:opacity-50"
                        >
                            {isCreateMode ? <Plus size={14} /> : <Pencil size={14} />}
                            {isCreateMode ? "Create" : "Save changes"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer btn-outline justify-center"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
