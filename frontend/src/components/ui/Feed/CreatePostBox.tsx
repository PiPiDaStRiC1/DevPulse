import { useState } from "react";
import { Smile } from "lucide-react";
import { Avatar } from "@/components/common";
import type { User } from "@/types";

interface CreatePostBoxProps {
    currentUser: User;
}

const tabs = ["Post", "Code", "Image"] as const;

export const CreatePostBox = ({ currentUser }: CreatePostBoxProps) => {
    const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Post");
    const [text, setText] = useState("");
    const maxChars = 280;

    const remaining = maxChars - text.length;
    const isOverLimit = remaining < 0;
    const isNearLimit = remaining <= 40;

    return (
        <div className="card mb-4">
            <div className="flex gap-3">
                <Avatar user={currentUser} size="md" />

                <div className="flex-1">
                    <div className="flex gap-1.5 mb-2.5">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`text-xs font-bold px-3 py-1 border-2 border-ink rounded-[var(--radius)] cursor-pointer font-[inherit] transition-all duration-100 ${
                                    activeTab === tab
                                        ? "bg-ink text-white"
                                        : "bg-transparent text-muted"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={
                            activeTab === "Code"
                                ? "Share a code snippet, tip, or clever trick..."
                                : activeTab === "Image"
                                  ? "Add a caption for your image..."
                                  : "What are you building? Share with the community..."
                        }
                        rows={3}
                        className="w-full resize-none text-sm font-medium leading-relaxed bg-transparent outline-none focus:outline-none border-0 text-text-base font-[inherit]"
                    />

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-ink-soft">
                        <button
                            className="text-base opacity-45 bg-transparent border-0 cursor-pointer hover:opacity-100 transition-opacity"
                            aria-label="attachment"
                        >
                            <Smile />
                        </button>

                        <div className="flex items-center gap-3">
                            {text.length > 0 && (
                                <span
                                    className={`text-xs font-bold tabular-nums ${isOverLimit ? "text-red-600" : isNearLimit ? "text-amber-600" : "text-muted"}`}
                                >
                                    {remaining}
                                </span>
                            )}
                            <button
                                disabled={text.trim().length === 0 || isOverLimit}
                                className="btn-solid py-1.5 px-4 text-sm"
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
