import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
    X,
    Sparkles,
    Eye,
    Bookmark,
    Send,
    FileText,
    Code2,
    Image as ImageIcon,
    Link2,
    Bold,
    Italic,
    Quote,
    List,
} from "lucide-react";
import type { User } from "@/types";
import { Avatar } from "@/components/common";
import type { ReactNode } from "react";

type ComposerTab = "Post" | "Code" | "Article";

interface PostComposerModalProps {
    open: boolean;
    onClose: () => void;
    currentUser: User;
}

const composerTabs: ComposerTab[] = ["Post", "Code", "Article"];

export const PostComposerModal = ({ open, onClose, currentUser }: PostComposerModalProps) => {
    const [activeTab, setActiveTab] = useState<ComposerTab>("Article");
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    useEffect(() => {
        if (!open) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    const previewTitle = title.trim() || "Your headline goes here";
    const previewBody =
        body.trim() ||
        "Write a few paragraphs here. The editor is intentionally quiet so the title stays in focus.";

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(26,46,26,0.62)] px-4 py-4 backdrop-blur-[2px]"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <div className="flex h-[min(88vh,920px)] w-full max-w-[1200px] flex-col overflow-hidden rounded-[var(--radius)] border-2 border-ink bg-surface shadow-[10px_10px_0_var(--ink)]">
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
                        <button className="btn-outline !py-2 !px-3">
                            <Bookmark size={14} />
                            Save draft
                        </button>
                        <button
                            onClick={onClose}
                            className="rounded-[var(--radius)] border-2 border-ink bg-bg p-2 text-muted transition-colors hover:text-text-base"
                            aria-label="Close composer"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                <div className="grid flex-1 min-h-0 lg:grid-cols-[minmax(0,1fr)_340px]">
                    <div className="flex min-h-0 flex-col border-b-2 border-ink lg:border-b-0 lg:border-r-2">
                        <div className="border-b border-ink-soft px-5 py-4">
                            <div className="flex flex-wrap gap-2">
                                {composerTabs.map((tab) => {
                                    const active = activeTab === tab;
                                    return (
                                        <button
                                            key={tab}
                                            type="button"
                                            onClick={() => setActiveTab(tab)}
                                            className={[
                                                "inline-flex items-center gap-2 rounded-[var(--radius)] border-2 border-ink px-3 py-1.5 text-[12px] font-bold transition-colors",
                                                active
                                                    ? "bg-ink text-accent-fg"
                                                    : "bg-transparent text-muted hover:text-text-base",
                                            ].join(" ")}
                                        >
                                            {tab === "Post" && <FileText size={13} />}
                                            {tab === "Code" && <Code2 size={13} />}
                                            {tab === "Article" && <ImageIcon size={13} />}
                                            {tab}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="grid flex-1 min-h-0 grid-rows-[auto,1fr,auto] px-5 py-5">
                            <div className="mb-5">
                                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.24em] text-muted">
                                    Title
                                </label>
                                <input
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
                                    placeholder="Write a headline that makes people stop scrolling"
                                    className="w-full border-0 bg-transparent text-[2.4rem] font-extrabold leading-[1.05] tracking-[-0.04em] text-text-base outline-none placeholder:text-subtle"
                                />
                            </div>

                            <div className="flex min-h-0 flex-col rounded-[var(--radius)] border-2 border-ink bg-bg shadow-[2px_2px_0_var(--ink)]">
                                <div className="flex flex-wrap items-center gap-1 border-b border-ink-soft px-3 py-2">
                                    <ToolButton label="H1" />
                                    <ToolButton label="H2" />
                                    <ToolButton icon={<Bold size={13} />} label="Bold" />
                                    <ToolButton icon={<Italic size={13} />} label="Italic" />
                                    <ToolButton icon={<Link2 size={13} />} label="Link" />
                                    <ToolButton icon={<Quote size={13} />} label="Quote" />
                                    <ToolButton icon={<List size={13} />} label="List" />
                                </div>

                                <textarea
                                    value={body}
                                    onChange={(event) => setBody(event.target.value)}
                                    placeholder={
                                        activeTab === "Code"
                                            ? "Share a code-focused post with context, a snippet, and a takeaway..."
                                            : activeTab === "Post"
                                              ? "Start with the point you want to make, then expand it in short sections."
                                              : "Write your article here. Think in headings, paragraphs, and short blocks."
                                    }
                                    className="min-h-0 flex-1 resize-none border-0 bg-transparent px-4 py-4 text-[15px] leading-[1.72] text-text-base outline-none placeholder:text-subtle"
                                />
                            </div>

                            <div className="mt-4 flex items-center justify-between text-[12px] text-muted">
                                <span>Markdown-friendly layout is already prepared visually.</span>
                                <span>{body.length} chars</span>
                            </div>
                        </div>
                    </div>

                    <aside className="flex min-h-0 flex-col bg-bg/65">
                        <div className="border-b-2 border-ink px-4 py-4">
                            <div className="flex items-center gap-3">
                                <Avatar user={currentUser} size="sm" />
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
                                    <h3 className="text-[1.4rem] font-extrabold leading-[1.15] tracking-[-0.02em] text-text-base">
                                        {previewTitle}
                                    </h3>
                                    <p className="text-[13px] leading-[1.7] text-text-base whitespace-pre-line">
                                        {previewBody}
                                    </p>
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        <span className="tag-badge !cursor-default">#DEV</span>
                                        <span className="tag-badge !cursor-default">#Markdown</span>
                                        <span className="tag-badge !cursor-default">#Writing</span>
                                    </div>
                                </div>
                            </div>

                            <div className="card p-4">
                                <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.24em] text-muted">
                                    Publishing
                                </div>
                                <div className="space-y-3 text-[13px] text-text-base">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted">Visibility</span>
                                        <span className="font-semibold">Public</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted">Format</span>
                                        <span className="font-semibold">Article</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted">Reading time</span>
                                        <span className="font-semibold">3 min</span>
                                    </div>
                                    <p className="pt-2 text-[12px] leading-relaxed text-muted">
                                        Keep the main writing area dominant. The sidebar is only for
                                        context, preview, and publishing state.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t-2 border-ink bg-surface px-4 py-4">
                            <div className="flex gap-2">
                                <button className="btn-outline flex-1 justify-center">
                                    Cancel
                                </button>
                                <button
                                    onClick={onClose}
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
        </div>,
        document.body,
    );
};

interface ToolButtonProps {
    label: string;
    icon?: ReactNode;
}

const ToolButton = ({ label, icon }: ToolButtonProps) => (
    <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-[var(--radius)] border border-ink-soft bg-surface px-2.5 py-1 text-[12px] font-semibold text-muted transition-colors hover:border-ink hover:text-text-base"
    >
        {icon}
        {label}
    </button>
);
