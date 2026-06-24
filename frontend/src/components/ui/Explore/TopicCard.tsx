import { Link } from "react-router-dom";
import { ArrowDownRight, Hash } from "lucide-react";
import { fmt } from "@/lib/utils";
import type { TopicTag } from "@shared/types";

interface TopicCardProps {
    topicTag: TopicTag;
    isLast: boolean;
}

export const TopicCard = ({ topicTag, isLast }: TopicCardProps) => {
    return (
        <>
            <Link
                to={`/explore/${topicTag.slug}`}
                className="card p-4 text-left cursor-pointer group bg-surface"
            >
                <div
                    className="w-8 h-8 rounded-[var(--radius)] mb-3 border-2 border-ink flex items-center justify-center"
                    style={{ boxShadow: "2px 2px 0 var(--ink)" }}
                >
                    <Hash size={13} className="text-ink" />
                </div>
                <p className="text-[13px] font-bold text-text-base group-hover:underline">
                    {topicTag.name}
                </p>
                <p className="text-[11px] text-muted mt-0.5">{fmt(topicTag.postsCount)} post(s)</p>
            </Link>
            {isLast && (
                <button className="card p-4 text-left cursor-pointer group bg-surface">
                    <div className="w-8 h-8 rounded-[var(--radius)] bg-ink mb-3 border-2 border-ink flex items-center justify-center">
                        <ArrowDownRight size={13} className="text-white" />
                    </div>
                    <p className="text-[13px] font-bold text-text-base group-hover:underline">
                        Load more
                    </p>
                </button>
            )}
        </>
    );
};
