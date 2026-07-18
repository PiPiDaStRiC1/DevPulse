import { CollectionList, BookmarkCard, Preloader, ErrorAlert, GuestBookmarks } from "@/components";
import { apiClient } from "@/lib/api";
import { Statistics } from "@/components";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store";
import type { Bookmark } from "@shared/types";

export const Bookmarks = () => {
    const { status } = useAuthStore();
    const {
        data: bookmarks,
        isLoading,
        isError,
    } = useQuery<Bookmark[]>({
        queryKey: ["bookmarks"],
        queryFn: apiClient.getAllBookmarks,
        staleTime: 5 * 60 * 1000,
        enabled: status === "authenticated",
    });

    if (status === "guest") {
        return <GuestBookmarks />;
    }

    return (
        <div className="flex justify-between gap-6">
            <section>
                <Statistics bookmarks={bookmarks ?? []} isLoading={isLoading} />

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
                            {isLoading ? (
                                <Preloader />
                            ) : isError ? (
                                <ErrorAlert />
                            ) : bookmarks && bookmarks.length > 0 ? (
                                bookmarks.map((bookmark) => (
                                    <BookmarkCard key={bookmark.id} bookmark={bookmark} />
                                ))
                            ) : (
                                <div className="rounded-md border-2 border-dashed border-ink-soft bg-surface px-5 py-8 text-center">
                                    <div className="text-lg font-extrabold mb-2">
                                        Nothing else to show
                                    </div>
                                    <p className="text-sm text-subtle max-w-md mx-auto">
                                        Bookmarks you add later can live here as a tidy reading
                                        queue.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </section>
            <CollectionList />
        </div>
    );
};
