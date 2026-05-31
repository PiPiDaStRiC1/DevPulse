import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { safeParseDate } from "@/lib/utils";
import type { Comment } from "@shared/types";

interface PostCommentProps {
    comment: Comment;
}

export const PostComment = ({ comment }: PostCommentProps) => {
    return (
        <article key={comment.id} className="card p-4 sm:p-5 shadow-none hover:shadow-none">
            <div className="flex gap-3">
                <div className="sq-avatar w-10 h-10 bg-[#f0ede3] text-[11px]">
                    U{comment.authorId}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-[12px] text-subtle mb-2">
                        <span className="font-semibold text-text-base">
                            User #{comment.authorId}
                        </span>
                        <span>·</span>
                        <span>{safeParseDate(comment.createdAt)}</span>
                    </div>

                    <div className="preview-markdown text-[14px]">
                        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                            {comment.text}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </article>
    );
};
