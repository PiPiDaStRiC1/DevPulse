import { CollectionList } from "@/components";

export const Bookmarks = () => {
    return (
        <div className="flex justify-between gap-6">
            <section>
                <section className="card p-4 sm:p-5 mb-6 overflow-hidden relative">
                    <div className="absolute inset-0 opacity-60 pointer-events-none">
                        <div className="absolute -top-12 right-10 w-32 h-32 rounded-full bg-av-green/10 blur-2xl" />
                        <div className="absolute bottom-0 left-16 w-40 h-40 rounded-full bg-av-teal/10 blur-2xl" />
                    </div>

                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <h1 className="mt-1 text-[20px] sm:text-[23px] font-extrabold tracking-[-0.03em] text-text-base">
                                Your bookmarks, organized like a reading desk
                            </h1>
                            <p className="text-subtle text-[13px] max-w-xl">
                                Collect posts, tutorials, and references you want to revisit without
                                losing them in the feed. This space is built for quick scanning and
                                calm reading.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full lg:w-auto lg:min-w-[340px]">
                            <div className="rounded-md border-2 border-ink bg-bg px-4 py-3 shadow-[var(--ink)]">
                                <div className="text-[11px] uppercase tracking-[0.18em] text-subtle mb-1">
                                    Saved
                                </div>
                                <div className="text-2xl font-black leading-none">24</div>
                            </div>
                            <div className="rounded-md border-2 border-ink bg-bg px-4 py-3 shadow-[var(--ink)]">
                                <div className="text-[11px] uppercase tracking-[0.18em] text-subtle mb-1">
                                    Collections
                                </div>
                                <div className="text-2xl font-black leading-none">5</div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid gap-6 lg:grid-cols-[1fr,320px] items-start">
                    <section className="space-y-5">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-xl font-extrabold tracking-tight">
                                    Recent bookmarks
                                </h2>
                                <p className="text-sm text-subtle">
                                    A quick stack of things worth reopening later.
                                </p>
                            </div>

                            <button className="btn-outline !py-2 !px-4 !text-sm">
                                Sort by date
                            </button>
                        </div>

                        <div className="grid gap-5">
                            <article className="card p-5 sm:p-6">
                                <div className="text-xs text-subtle uppercase tracking-[0.18em] mb-1">
                                    Saved 2 days ago
                                </div>

                                <h3 className="text-lg sm:text-xl font-extrabold tracking-tight mb-2">
                                    Build a responsive command palette with keyboard navigation.
                                </h3>
                                <p className="text-sm sm:text-[15px] text-muted mb-4 max-w-3xl">
                                    A compact pattern for quick access actions, layered
                                    interactions, and accessible focus states that feels polished in
                                    a product UI.
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {["UI", "Accessibility", "React"].map((tag) => (
                                        <span key={tag} className="tag-badge cursor-default">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <button className="btn-solid !py-2 !px-4 !text-sm">
                                        Open article
                                    </button>
                                    <button className="btn-outline !py-2 !px-4 !text-sm">
                                        Move to collection
                                    </button>
                                </div>
                            </article>

                            <article className="card p-5 sm:p-6">
                                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="sq-avatar w-11 h-11 bg-av-green text-white text-[12px]">
                                            BW
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-xs text-subtle uppercase tracking-[0.18em] mb-1">
                                                Saved from
                                            </div>
                                            <div className="font-semibold text-text-base">
                                                Backend Workshop
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-subtle">Saved last week</div>
                                </div>

                                <h3 className="text-lg sm:text-xl font-extrabold tracking-tight mb-2">
                                    Nested REST routes that stay readable as the app grows.
                                </h3>
                                <p className="text-sm sm:text-[15px] text-muted mb-4 max-w-3xl">
                                    A clean reference for modelling resources like posts, comments,
                                    chats, and messages without losing the connection between them.
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {["REST", "API", "Architecture"].map((tag) => (
                                        <span key={tag} className="tag-badge cursor-default">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <button className="btn-solid !py-2 !px-4 !text-sm">
                                        Open article
                                    </button>
                                    <button className="btn-outline !py-2 !px-4 !text-sm">
                                        Archive
                                    </button>
                                </div>
                            </article>

                            <div className="rounded-md border-2 border-dashed border-ink-soft bg-surface px-5 py-8 text-center">
                                <div className="text-lg font-extrabold mb-2">
                                    Nothing else to show
                                </div>
                                <p className="text-sm text-subtle max-w-md mx-auto">
                                    Bookmarks you add later can live here as a tidy reading queue.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </section>
            <CollectionList />
        </div>
    );
};
