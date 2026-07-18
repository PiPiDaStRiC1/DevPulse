import type { Bookmark } from "@shared/types";

interface StatisticsProps {
    bookmarks: Bookmark[];
    isLoading: boolean;
}

export const Statistics = ({ bookmarks, isLoading }: StatisticsProps) => {
    return (
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
                        Collect posts, tutorials, and references you want to revisit without losing
                        them in the feed. This space is built for quick scanning and calm reading.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full lg:w-auto lg:min-w-[340px]">
                    <div className="rounded-md border-2 border-ink bg-bg px-4 py-3 shadow-[var(--ink)]">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-subtle mb-1">
                            Saved
                        </div>
                        {isLoading ? (
                            <div className="w-10 h-6 bg-ink-soft/70 animate-pulse" />
                        ) : (
                            <div className="text-2xl font-black leading-none">
                                {bookmarks?.length ?? 0}
                            </div>
                        )}
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
    );
};
