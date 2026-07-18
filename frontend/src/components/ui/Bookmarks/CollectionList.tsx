import { useState } from "react";
import { ChevronRight, Layers3, Plus, Pencil } from "lucide-react";
import { CollectionInfo } from "./CollectionInfo";
import { CollectionEditorModal } from "./CollectionEditorModal";

type CollectionPost = {
    id: number;
    title: string;
    excerpt: string;
    authorName: string;
    authorHandle: string;
    tags: string[];
};

type CollectionItem = {
    name: string;
    count: number;
    tone: string;
    note: string;
    posts: CollectionPost[];
};

type CollectionDraft = { name: string; note: string };

const initialCollections: CollectionItem[] = [
    {
        name: "Design patterns",
        count: 7,
        tone: "bg-av-teal/10",
        note: "Layout ideas, UI decisions, and reusable component patterns.",
        posts: [
            {
                id: 184,
                title: "How to build a dense but readable card system",
                excerpt: "Spacing, hierarchy, and affordances that make dense lists feel calm.",
                authorName: "Artem Volkov",
                authorHandle: "artem",
                tags: ["ui", "cards", "layout"],
            },
            {
                id: 227,
                title: "Navigation that feels native on content-heavy pages",
                excerpt:
                    "A practical breakdown of sticky panels, content anchors, and quick jumps.",
                authorName: "Kate Miller",
                authorHandle: "katem",
                tags: ["ux", "navigation"],
            },
            {
                id: 311,
                title: "Why grip handles improve sortable collections",
                excerpt: "A tiny visual cue can make drag interactions feel obvious and safe.",
                authorName: "Nikita Ivanov",
                authorHandle: "nikiv",
                tags: ["interaction", "drag-drop"],
            },
        ],
    },
    {
        name: "API references",
        count: 9,
        tone: "bg-av-blue/10",
        note: "Implementation notes, snippets, and docs worth revisiting later.",
        posts: [
            {
                id: 198,
                title: "Socket flow for lightweight realtime updates",
                excerpt: "A compact pattern for pushing read states and live reactions.",
                authorName: "Maksim S.",
                authorHandle: "maksim",
                tags: ["socket.io", "realtime"],
            },
            {
                id: 262,
                title: "Prisma relations for content platforms",
                excerpt: "Bookmarks, follows, comments, and many-to-many tag structures.",
                authorName: "Lena Fox",
                authorHandle: "lenafox",
                tags: ["prisma", "database"],
            },
            {
                id: 319,
                title: "Zod schemas that keep client and server aligned",
                excerpt: "The shared layer becomes more useful when validation stays centralized.",
                authorName: "Andrey P.",
                authorHandle: "andp",
                tags: ["zod", "shared"],
            },
        ],
    },
    {
        name: "Need to revisit",
        count: 4,
        tone: "bg-av-orange/10",
        note: "Saved items for deeper reading, later edits, and follow-up ideas.",
        posts: [
            {
                id: 155,
                title: "Building a compact reading desk for saved content",
                excerpt: "Organize bookmarks like a working surface, not a dump zone.",
                authorName: "Olga K.",
                authorHandle: "olga",
                tags: ["bookmarks", "reading"],
            },
            {
                id: 241,
                title: "Better empty states for content collections",
                excerpt: "Empty should feel like the start of a workflow, not a dead end.",
                authorName: "Sergey D.",
                authorHandle: "sergd",
                tags: ["empty-state", "product"],
            },
            {
                id: 290,
                title: "How to explain code with AI without losing context",
                excerpt:
                    "The explanation should stay close to the snippet and its surrounding intent.",
                authorName: "Irina V.",
                authorHandle: "irv",
                tags: ["ai", "code", "context"],
            },
        ],
    },
];

export const CollectionList = () => {
    const [collections, setCollections] = useState<CollectionItem[]>(initialCollections);
    const [activeCollection, setActiveCollection] = useState<CollectionItem | null>(null);
    const [editorMode, setEditorMode] = useState<"create" | "edit" | null>(null);
    const [draftCollection, setDraftCollection] = useState<CollectionItem | null>(null);

    const openCreateModal = () => {
        setDraftCollection(null);
        setEditorMode("create");
    };

    const openEditModal = (collection: CollectionItem) => {
        setDraftCollection(collection);
        setEditorMode("edit");
    };

    const handleSaveCollection = (draft: CollectionDraft) => {
        if (!draft.name || !draft.note) {
            return;
        }

        if (editorMode === "create") {
            const nextCollection: CollectionItem = {
                name: draft.name,
                note: draft.note,
                count: 0,
                tone: "bg-av-green/10",
                posts: [],
            };

            setCollections((current) => [nextCollection, ...current]);
        }

        if (editorMode === "edit" && draftCollection) {
            setCollections((current) =>
                current.map((collection) =>
                    collection.name === draftCollection.name
                        ? { ...collection, name: draft.name, note: draft.note }
                        : collection,
                ),
            );

            setActiveCollection((current) =>
                current && current.name === draftCollection.name
                    ? { ...current, name: draft.name, note: draft.note }
                    : current,
            );
        }

        setEditorMode(null);
        setDraftCollection(null);
    };

    return (
        <>
            <aside className="w-90 space-y-5">
                <div className="sticky top-20 flex flex-col gap-2 card p-5">
                    <div className="flex items-start justify-between gap-4">
                        <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-muted">
                            <Layers3 size={13} />
                            Collections
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            type="button"
                            aria-label="Create new collection"
                            title="Create new collection"
                            onClick={openCreateModal}
                            className="w-full flex justify-center btn-solid whitespace-nowrap py-2.5 px-4"
                        >
                            <Plus size={15} />
                            Add collection
                        </button>
                        {collections.map((item) => (
                            <div
                                key={item.name}
                                className="group rounded-[var(--radius)] border-2 border-ink-soft bg-bg p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink hover:shadow-[var(--ink)]"
                            >
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setActiveCollection(item)}
                                        className="min-w-0 flex-1 text-left"
                                    >
                                        <span className="flex items-center gap-2 text-sm font-extrabold tracking-tight text-text-base">
                                            <span className="truncate">{item.name}</span>
                                            <span className="rounded-full border border-ink-soft bg-surface px-2 py-0.5 text-[11px] font-bold text-muted">
                                                {item.count}
                                            </span>
                                        </span>
                                        <span className="mt-1 block text-[12px] text-subtle line-clamp-2">
                                            {item.note}
                                        </span>
                                    </button>

                                    <div className="flex shrink-0 items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => openEditModal(item)}
                                            className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink-soft bg-surface text-muted transition-colors hover:border-ink hover:text-ink"
                                            aria-label={`Edit ${item.name}`}
                                            title="Edit collection"
                                        >
                                            <Pencil size={14} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setActiveCollection(item)}
                                            className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink-soft bg-surface text-muted transition-colors group-hover:border-ink group-hover:text-ink"
                                            aria-label={`Open ${item.name}`}
                                            title="Open collection"
                                        >
                                            <ChevronRight size={15} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>
            {activeCollection && (
                <CollectionInfo
                    activeCollection={activeCollection}
                    closeModal={() => setActiveCollection(null)}
                    onEdit={() => openEditModal(activeCollection)}
                />
            )}

            {editorMode && (
                <CollectionEditorModal
                    mode={editorMode}
                    {...(draftCollection
                        ? {
                              initialValue: {
                                  name: draftCollection.name,
                                  note: draftCollection.note,
                              },
                          }
                        : {})}
                    onClose={() => {
                        setEditorMode(null);
                        setDraftCollection(null);
                    }}
                    onSave={handleSaveCollection}
                />
            )}
        </>
    );
};
