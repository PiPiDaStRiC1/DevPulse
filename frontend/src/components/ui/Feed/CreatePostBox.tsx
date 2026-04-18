import { useState } from "react";
import { PenLine, Sparkles, FileText, Code2, Image as ImageIcon, ArrowRight } from "lucide-react";
import { Avatar } from "@/components/common";
import { PostComposerModal } from "./PostComposerModal.tsx";
import type { User } from "@/types";

interface CreatePostBoxProps {
    currentUser: User;
}

const tabs = ["Post", "Code", "Image"] as const;

export const CreatePostBox = ({ currentUser }: CreatePostBoxProps) => {
    const [isComposerOpen, setIsComposerOpen] = useState(false);

    return (
        <>
            <div className="card mb-2 overflow-hidden">
                <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                        <Avatar user={currentUser} size="md" />

                        <div className="min-w-0">
                            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-muted">
                                <Sparkles size={12} />
                                Writing space
                            </div>
                            <h3 className="mt-1 text-[20px] sm:text-[23px] font-extrabold tracking-[-0.03em] text-text-base">
                                Open a distraction-free editor
                            </h3>
                            <p className="mt-1 max-w-[42ch] text-[13px] leading-relaxed text-muted">
                                Keep the feed clean. Open a separate composer for posts, code, and
                                longer thoughts without breaking your reading flow.
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                                {tabs.map((tab, index) => (
                                    <span key={tab} className="tag-badge !cursor-default">
                                        {index === 0 ? (
                                            <FileText
                                                size={12}
                                                className="inline-block mr-1 -mt-0.5"
                                            />
                                        ) : null}
                                        {index === 1 ? (
                                            <Code2
                                                size={12}
                                                className="inline-block mr-1 -mt-0.5"
                                            />
                                        ) : null}
                                        {index === 2 ? (
                                            <ImageIcon
                                                size={12}
                                                className="inline-block mr-1 -mt-0.5"
                                            />
                                        ) : null}
                                        {tab}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 lg:shrink-0">
                        <div className="hidden lg:block h-12 w-px bg-ink-soft" />
                        <button
                            type="button"
                            onClick={() => setIsComposerOpen(true)}
                            className="btn-solid whitespace-nowrap py-2.5 px-4"
                        >
                            <PenLine size={15} />
                            Open editor
                            <ArrowRight size={15} />
                        </button>
                    </div>
                </div>

                <div className="border-t border-ink-soft bg-bg/60 px-4 py-2.5 sm:px-5 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-muted">
                    <span>Full-screen writing mode</span>
                    <span>Markdown-ready layout</span>
                    <span>Private drafts later</span>
                </div>
            </div>

            <PostComposerModal
                open={isComposerOpen}
                onClose={() => setIsComposerOpen(false)}
                currentUser={currentUser}
            />
        </>
    );
};
