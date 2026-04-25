import { useState } from "react";
import { Tips } from "@/components";
import { FileText, Code2, BookOpenText } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ComposerTab = "Post" | "Code" | "Article";

interface ComposerTabInfo {
    label: ComposerTab;
    icon: LucideIcon;
}

interface TextEditorProps {
    body: string;
    setBody: (value: string) => void;
}

const composerTabs: ComposerTabInfo[] = [
    { label: "Post", icon: FileText },
    { label: "Code", icon: Code2 },
    { label: "Article", icon: BookOpenText },
];

export const TextEditor = ({ body, setBody }: TextEditorProps) => {
    const [activeTab, setActiveTab] = useState<ComposerTab>("Article");
    const [showTips, setShowTips] = useState(false);

    return (
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
                        onChange={(e) => setBody(e.target.value)}
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
                    <span>Tip: add "# " at the beginning to define your post title.</span>
                    <span>{body.length} chars</span>
                </div>
            </div>
        </div>
    );
};
