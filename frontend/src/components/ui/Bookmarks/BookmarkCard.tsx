import { safeParseDate } from "@/lib/utils";
import { X, GripVertical } from "lucide-react";
import { Link } from "react-router-dom";
import { CustomReactMarkdown } from "@/features";
import { useTogglePostStats } from "@/hooks";
import type { Bookmark } from "@shared/types";

interface BookmarkCardProps {
    bookmark: Bookmark;
}

// Сделать drag-drop для перемещения в коллекцию

export const BookmarkCard = ({ bookmark }: BookmarkCardProps) => {
    const { toggleBookmarkPost } = useTogglePostStats(bookmark.postId);

    return (
        <article className="group cursor-grab relative overflow-hidden card p-4 sm:p-5">
            <div className="flex gap-4">
                <button
                    type="button"
                    aria-label={`Drag bookmark for ${bookmark.postTitle}`}
                    title="Drag to reorder"
                    className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-ink-soft bg-bg/80 text-ink shadow-[var(--ink)] transition-all duration-200 cursor-grab select-none touch-none hover:border-ink hover:bg-av-teal/10 active:cursor-grabbing"
                >
                    <GripVertical size={19} strokeWidth={2.4} />
                </button>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <div className="text-[11px] text-subtle uppercase tracking-[0.18em] mb-1.5">
                                Saved at {safeParseDate(bookmark.createdAt)}
                            </div>

                            <h3 className="text-lg sm:text-xl font-extrabold tracking-tight leading-tight mb-2 line-clamp-2">
                                {bookmark.postTitle}
                            </h3>
                        </div>

                        <button
                            type="button"
                            aria-label="Remove from bookmarks"
                            title="Remove from bookmarks"
                            className="cursor-pointer mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-ink-soft bg-bg text-ink transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-bg"
                            onClick={() =>
                                toggleBookmarkPost({ postId: bookmark.postId, isBookmarked: true })
                            }
                        >
                            <X size={18} className="shrink-0" />
                        </button>
                    </div>

                    <div className="preview-markdown text-text-base mb-4 line-clamp-3">
                        <CustomReactMarkdown content={bookmark.postExcerpt} />
                    </div>

                    <div className="mb-4 flex flex-wrap gap-2">
                        {bookmark.tags.map((tag) => (
                            <span key={tag} className="tag-badge cursor-default">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <Link
                            to={`/profile/${bookmark.author.handle}`}
                            className="!no-underline hover:!underline flex min-w-0 items-center gap-1.5 text-[13px]"
                        >
                            <span className="text-muted">Author: </span>
                            <span className="font-semibold text-text-base truncate">
                                {bookmark.author.username}
                            </span>
                            <span className="text-muted shrink-0">@{bookmark.author.handle}</span>
                        </Link>

                        <Link
                            to={`/posts/${bookmark.postId}`}
                            className="btn-solid !py-2 !px-4 !text-sm whitespace-nowrap"
                        >
                            Open article
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
};
