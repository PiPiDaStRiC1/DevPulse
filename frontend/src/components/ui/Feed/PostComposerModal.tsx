import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
    X,
    Sparkles,
    Eye,
    Bookmark,
    Send,
    FileText,
    Code2,
    BookOpenText,
    Maximize2,
} from "lucide-react";
import { Avatar } from "@/components/common";
import { PostModalOptions, Tips } from "./index";
import { currentUser } from "@/lib/constants/mockData";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { apiClient } from "@/lib/api";
import toast from "react-hot-toast";
import type { LucideIcon } from "lucide-react";

type ComposerTab = "Post" | "Code" | "Article";

interface ComposerTabInfo {
    label: ComposerTab;
    icon: LucideIcon;
}

const composerTabs: ComposerTabInfo[] = [
    { label: "Post", icon: FileText },
    { label: "Code", icon: Code2 },
    { label: "Article", icon: BookOpenText },
];

const PREVIEW_CHAR_LIMIT = 250;

export const PostComposerModal = () => {
    const navigate = useNavigate();
    const postModalRef = useRef<HTMLDivElement>(null);
    const fullPreviewModalRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState<ComposerTab>("Article");
    const [body, setBody] = useState("");
    const [showTips, setShowTips] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const previewBody = body.trim() || "You text will be here...";
    const previewExcerpt =
        previewBody.length > PREVIEW_CHAR_LIMIT
            ? `${previewBody.slice(0, PREVIEW_CHAR_LIMIT).trimEnd()}...`
            : previewBody;

    const onClose = useCallback(() => navigate(-1), [navigate]);

    const handlePostSubmit = async () => {
        try {
            await apiClient.postOnePost({
                content: body,
                tags: ["DEV", "Markdown", "Writing"],
                techStack: ["React", "TypeScript"],
                codeSnippet: null,
                comments: [],
                image: null,
            });
            onClose();
        } catch (error) {
            console.error("Failed to create post", error);
            toast.error("Failed to create post");
        }
    };

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [onClose]);

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isPreviewOpen) {
                if (
                    fullPreviewModalRef.current &&
                    !fullPreviewModalRef.current.contains(event.target as Node)
                ) {
                    setIsPreviewOpen(false);
                }

                return;
            }

            if (postModalRef.current && !postModalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose, setIsPreviewOpen, isPreviewOpen]);

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(26,46,26,0.62)] px-4 py-4 backdrop-blur-[2px]">
            <div
                ref={postModalRef}
                className="flex h-[min(88vh,920px)] w-full max-w-[1200px] flex-col overflow-hidden rounded-[var(--radius)] border-2 border-ink bg-surface shadow-[10px_10px_0_var(--ink)]"
            >
                <div className="flex items-center justify-between border-b-2 border-ink px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="border-2 border-ink rounded-[var(--radius)] bg-bg p-1.5 shadow-[2px_2px_0_var(--ink)]">
                            <Sparkles size={15} className="text-ink" />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-muted">
                                New draft
                            </p>
                            <p className="text-[13px] text-subtle">
                                Minimal workspace with preview and markdown-ready structure.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="cursor-pointer btn-outline !py-1 !px-3">
                            <Bookmark size={14} />
                            Save draft
                        </button>
                        <button
                            onClick={onClose}
                            className="cursor-pointer rounded-[var(--radius)] border-2 border-ink bg-bg p-2 text-muted transition-colors hover:text-text-base"
                            aria-label="Close composer"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>

                <div className="grid flex-1 min-h-0 lg:grid-cols-[minmax(0,1fr)_340px]">
                    <div className="flex min-h-0 flex-col border-b-2 border-ink lg:border-b-0 lg:border-r-2">
                        <div className="border-b border-ink-soft px-5 py-4">
                            <div className="flex flex-wrap gap-2">
                                {composerTabs.map((tab) => {
                                    const active = activeTab === tab.label;
                                    return (
                                        <button
                                            key={tab.label}
                                            type="button"
                                            onClick={() => setActiveTab(tab.label)}
                                            className={[
                                                "cursor-pointer inline-flex items-center gap-2 rounded-[var(--radius)] border-2 border-ink px-3 py-1.5 text-[12px] font-bold transition-colors",
                                                active
                                                    ? "bg-ink text-accent-fg"
                                                    : "bg-transparent text-muted hover:text-text-base",
                                            ].join(" ")}
                                        >
                                            {tab.icon && <tab.icon size={13} />}
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="h-full flex flex-col justify-between px-5 py-5">
                            <div className="flex-grow-1 relative flex min-h-0 flex-col rounded-[var(--radius)] border-2 border-ink bg-bg shadow-[2px_2px_0_var(--ink)]">
                                <div className="flex items-center justify-between border-b border-ink-soft px-3 py-2">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-muted">
                                        Markdown editor
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setShowTips((prev) => !prev)}
                                        className="cursor-pointer inline-flex items-center gap-1.5 rounded-[var(--radius)] border border-ink-soft bg-surface px-2.5 py-1 text-[11px] font-semibold text-muted transition-colors hover:border-ink hover:text-text-base"
                                    >
                                        <BookOpenText size={12} />
                                        {showTips ? "Hide tips" : "Show tips"}
                                    </button>
                                </div>

                                {showTips && <Tips />}

                                <textarea
                                    value={body}
                                    onChange={(event) => setBody(event.target.value)}
                                    placeholder={
                                        activeTab === "Code"
                                            ? "Try:\n# What I learned today\n\n```ts\nconst result = await prisma.user.findMany();\n```\n\n- Why this works\n- Where it can fail"
                                            : activeTab === "Post"
                                              ? "Try:\n# Main point\n\nShort intro paragraph.\n\n## Key takeaways\n- First insight\n- Second insight"
                                              : "Write your article in Markdown. Start with # Heading and break ideas into short sections."
                                    }
                                    className="min-h-0 flex-1 resize-none border-0 bg-transparent px-4 py-4 text-[15px] leading-[1.72] text-text-base outline-none placeholder:text-subtle"
                                />
                            </div>

                            <div className="mt-4 flex items-center justify-between text-[12px] text-muted">
                                <span>
                                    Tip: add "# " at the beginning to define your post title.
                                </span>
                                <span>{body.length} chars</span>
                            </div>
                        </div>
                    </div>

                    <aside className="flex min-h-0 flex-col bg-bg/65">
                        <div className="border-b-2 border-ink px-4 py-4">
                            <div className="flex items-center gap-3">
                                <Avatar handle={currentUser.handle} size="sm" />
                                <div className="min-w-0">
                                    <p className="text-[13px] font-bold text-text-base">
                                        {currentUser.username}
                                    </p>
                                    <p className="text-[12px] text-muted">@{currentUser.handle}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4 overflow-y-auto p-4">
                            <div className="card p-4">
                                <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-muted">
                                    <Eye size={13} />
                                    Preview
                                </div>
                                <div className="space-y-3">
                                    <div className="text-[13px] leading-[1.7] text-base overflow-y-auto">
                                        <div className="preview-markdown">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm, remarkBreaks]}
                                            >
                                                {previewExcerpt}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                    {previewBody.length > PREVIEW_CHAR_LIMIT && (
                                        <button
                                            type="button"
                                            onClick={() => setIsPreviewOpen(true)}
                                            className="cursor-pointer inline-flex items-center gap-1.5 rounded-[var(--radius)] border border-ink-soft bg-bg px-2.5 py-1 text-[12px] font-semibold text-muted transition-colors hover:border-ink hover:text-text-base"
                                        >
                                            <Maximize2 size={12} />
                                            Open full preview
                                        </button>
                                    )}
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        <span className="tag-badge !cursor-default">#DEV</span>
                                        <span className="tag-badge !cursor-default">#Markdown</span>
                                        <span className="tag-badge !cursor-default">#Writing</span>
                                    </div>
                                </div>
                            </div>

                            <PostModalOptions />
                        </div>

                        <div className="border-t-2 border-ink bg-surface px-4 py-4">
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="btn-outline flex-1 justify-center"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    onClick={handlePostSubmit}
                                    className="btn-solid flex-1 justify-center"
                                >
                                    <Send size={14} />
                                    Publish
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {isPreviewOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(26,46,26,0.52)] px-4 py-6">
                    <div
                        ref={fullPreviewModalRef}
                        className="flex h-[min(86vh,860px)] w-full max-w-[860px] flex-col overflow-hidden rounded-[var(--radius)] border-2 border-ink bg-surface shadow-[8px_8px_0_var(--ink)]"
                    >
                        <div className="flex items-center justify-between border-b-2 border-ink px-4 py-3">
                            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-muted">
                                Full preview
                            </p>
                            <button
                                onClick={() => setIsPreviewOpen(false)}
                                className="cursor-pointer rounded-[var(--radius)] border-2 border-ink bg-bg p-2 text-muted transition-colors hover:text-text-base"
                                aria-label="Close modal"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                            <div className="preview-markdown">
                                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                                    {body}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>,
        document.body,
    );
};
