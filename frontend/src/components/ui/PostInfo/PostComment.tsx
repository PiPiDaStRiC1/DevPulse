import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { safeParseDate } from "@/lib/utils";
import { Avatar } from "@/components";
import type { Comment } from "@shared/types";

interface PostCommentProps {
    comment: Comment;
}

export const PostComment = ({ comment }: PostCommentProps) => {
    const displayName = comment.author?.username ?? `User #${comment.authorId}`;
    const handle = comment.author?.handle ?? `user-${comment.authorId}`;

    return (
        <article className="card p-4 sm:p-5 shadow-none hover:shadow-none">
            <div className="flex gap-3">
                <Avatar handle={handle} link={`/profile/${handle}`} />

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-[12px] text-subtle mb-2">
                        <Link
                            to={`/profile/${handle}`}
                            className="flex items-center gap-1 font-semibold text-text-base hover:underline"
                        >
                            {displayName}
                            {comment.author?.isVerified && (
                                <BadgeCheck size={13} className="text-av-blue" />
                            )}
                        </Link>
                        <span className="text-subtle">@{handle}</span>
                        <span>·</span>
                        <span>{safeParseDate(comment.createdAt)}</span>
                    </div>

                    <div className="preview-markdown rounded-md border border-ink-soft bg-bg/60 px-3 py-2 text-[14px]">
                        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                            {comment.text}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </article>
    );
};
