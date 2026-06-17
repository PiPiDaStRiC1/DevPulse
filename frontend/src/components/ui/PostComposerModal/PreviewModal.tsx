import { forwardRef } from "react";
import { X } from "lucide-react";
import { CustomReactMarkdown } from "@/features";
import type { ForwardedRef } from "react";

interface PreviewModalProps {
    body: string;
    heading: string;
    closeModal: () => void;
}

export const PreviewModal = forwardRef(
    (props: PreviewModalProps, ref: ForwardedRef<HTMLDivElement>) => {
        const { body, heading, closeModal } = props;

        return (
            <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(26,46,26,0.52)] px-4 py-6">
                <div
                    ref={ref}
                    className="flex h-[min(86vh,860px)] w-full max-w-[860px] flex-col overflow-hidden rounded-[var(--radius)] border-2 border-ink bg-surface shadow-[8px_8px_0_var(--ink)]"
                >
                    <div className="flex items-center justify-between border-b-2 border-ink px-4 py-3">
                        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-muted">
                            Full preview
                        </p>
                        <button
                            onClick={closeModal}
                            className="cursor-pointer rounded-[var(--radius)] border-2 border-ink bg-bg p-2 text-muted transition-colors hover:text-text-base"
                            aria-label="Close modal"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto px-5">
                        <div className="preview-markdown">
                            <div className="flex flex-col gap-3">
                                <h1>{heading}</h1>
                                <CustomReactMarkdown content={body} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
);
