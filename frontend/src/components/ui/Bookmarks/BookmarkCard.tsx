import { safeParseDate } from "@/lib/utils";
import { Delete } from "lucide-react";
import { Link } from "react-router-dom";
import { CustomReactMarkdown } from "@/features";
import type { Bookmark } from "@shared/types";
import { useTogglePostStats } from "@/hooks";

interface BookmarkCardProps {
    bookmark: Bookmark;
}

export const BookmarkCard = ({ bookmark }: BookmarkCardProps) => {
    const { toggleBookmarkPost } = useTogglePostStats(bookmark.postId);

    return (
        <article className="card p-5 sm:p-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col items-start justify-center">
                    <div className="text-xs text-subtle uppercase tracking-[0.18em] mb-1">
                        Saved at {safeParseDate(bookmark.createdAt)}
                    </div>

                    <h3 className="text-lg sm:text-xl font-extrabold tracking-tight mb-2">
                        {bookmark.postTitle}
                    </h3>
                </div>
                <button
                    className="cursor-pointer"
                    onClick={() =>
                        toggleBookmarkPost({ postId: bookmark.postId, isBookmarked: true })
                    }
                >
                    <Delete size={21} className="text-ink shrink-0" />
                </button>
            </div>
            <div className="preview-markdown mb-2">
                <CustomReactMarkdown content={bookmark.postExcerpt} />
            </div>

            <div className="flex flex-wrap gap-2 mb-2">
                {bookmark.tags.map((tag) => (
                    <span key={tag} className="tag-badge cursor-default">
                        #{tag}
                    </span>
                ))}
            </div>

            <Link
                to={`/profile/${bookmark.author.handle}`}
                className="!no-underline hover:!underline flex items-center justify-center gap-1.5 text-[13px]"
            >
                <span className="text-muted">Author: </span>
                <span className="font-semibold text-text-base">{bookmark.author.username}</span>
                <span className="text-muted">@{bookmark.author.handle}</span>
            </Link>

            <div className="flex flex-wrap gap-3">
                <Link to={`/posts/${bookmark.postId}`} className="btn-solid !py-2 !px-4 !text-sm">
                    Open article
                </Link>
                <button className="btn-outline !py-2 !px-4 !text-sm">Move to collection</button>
            </div>
        </article>
    );
};
