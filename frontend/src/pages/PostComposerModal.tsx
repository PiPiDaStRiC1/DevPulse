import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { X, Sparkles, Eye, Bookmark, Send, Maximize2 } from "lucide-react";
import { Avatar, ErrorAlert, PostModalOptions, TextEditor } from "@/components";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { apiClient } from "@/lib/api";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@shared/types";

const PREVIEW_CHAR_LIMIT = 250;
const SAVED_TIMER = 10000;

const initDraft = (): { body: string; tags: string[] } => {
    try {
        const raw = localStorage.getItem("draft-post");
        if (!raw) return { body: "", tags: [] };

        return JSON.parse(raw);
    } catch (error) {
        console.error("Failed to parse draft post from localStorage", error);
        return { body: "", tags: [] };
    }
};

const initBody: () => string = () => initDraft().body;
const initTags: () => string[] = () => initDraft().tags;

export const PostComposerModal = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const postModalRef = useRef<HTMLDivElement>(null);
    const fullPreviewModalRef = useRef<HTMLDivElement>(null);
    const saveTimer = useRef<number | null>(null);
    const [body, setBody] = useState(initBody);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isAddingTag, setIsAddingTag] = useState(false);
    const [tags, setTags] = useState<string[]>(initTags);

    const previewBody = body.trim() || "You text will be here...";
    const previewExcerpt =
        previewBody.length > PREVIEW_CHAR_LIMIT
            ? `${previewBody.slice(0, PREVIEW_CHAR_LIMIT).trimEnd()}...`
            : previewBody;

    const {
        data: currentUser,
        isLoading,
        isError,
    } = useQuery<User>({ queryKey: ["me"], queryFn: apiClient.me, staleTime: 30 * 60 * 1000 });

    const handleSaveDraft = useCallback(() => {
        localStorage.setItem("draft-post", JSON.stringify({ body, tags }));
        toast.success("Draft saved locally");
    }, [body, tags]);

    const handleAddTag = (newTag: string) => {
        if (newTag !== "" && !tags.includes(newTag)) {
            setTags((prev) => [...prev, newTag]);
            setIsAddingTag(false);
        } else {
            setIsAddingTag(false);
        }
    };

    const handleToggleTag = (tag: string) => {
        setTags((prev) => prev.filter((el) => el !== tag));
    };

    const onClose = useCallback(() => navigate(-1), [navigate]);

    const handlePostSubmit = async () => {
        try {
            await apiClient.postOnePost({
                content: body,
                tags: tags,
                techStack: ["React", "TypeScript"],
                codeSnippet: null,
                comments: [],
                image: null,
            });

            queryClient.invalidateQueries({ queryKey: ["feed"] });
            localStorage.removeItem("draft-post");
            onClose();
        } catch (error) {
            console.error("Failed to create post", error);
            toast.error("Failed to create post");
        }
    };

    useEffect(() => {
        saveTimer.current = setInterval(() => {
            handleSaveDraft();
        }, SAVED_TIMER);

        return () => {
            if (saveTimer.current) {
                clearInterval(saveTimer.current);
            }
        };
    }, [handleSaveDraft]);

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
                        <button
                            className="cursor-pointer btn-outline !py-1 !px-3"
                            onClick={handleSaveDraft}
                        >
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
                    <TextEditor body={body} setBody={setBody} />
                    <aside className="flex min-h-0 flex-col bg-bg/65">
                        {isError ? (
                            <ErrorAlert message="Failed to load user" />
                        ) : (
                            <>
                                {currentUser && (
                                    <div className="border-b-2 border-ink px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar
                                                handle={currentUser.handle}
                                                size="sm"
                                                isLoading={isLoading}
                                            />
                                            <div className="min-w-0">
                                                <p className="text-[13px] font-bold text-text-base">
                                                    {currentUser.username}
                                                </p>
                                                <p className="text-[12px] text-muted">
                                                    @{currentUser.handle}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

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
                                        {isAddingTag && (
                                            <input
                                                type="text"
                                                autoFocus
                                                onBlur={(e) => handleAddTag(e.currentTarget.value)}
                                                className="tag-badge bg-bg border-2 border-ink p-1.5 text-[12px] text-muted rounded-[var(--radius)]"
                                            />
                                        )}
                                        {tags.map((tag) => (
                                            <span
                                                key={tag}
                                                onClick={() => handleToggleTag(tag)}
                                                className="tag-badge gap-2"
                                            >
                                                {tag}
                                                <X size={13} />
                                            </span>
                                        ))}
                                        <span
                                            className="tag-badge"
                                            onClick={() => setIsAddingTag(true)}
                                        >
                                            + Add Tag
                                        </span>
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
