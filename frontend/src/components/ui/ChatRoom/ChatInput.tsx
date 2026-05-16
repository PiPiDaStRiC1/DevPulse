import { useState } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
    onSendMessage: (message: string) => void;
}

export const ChatInput = ({ onSendMessage }: ChatInputProps) => {
    const [draft, setDraft] = useState("");

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSendMessage(draft);
        setDraft("");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="px-4 py-3 border-t-2 border-ink bg-surface shrink-0 flex items-end gap-3"
        >
            <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Whisper something…"
                className={[
                    "flex-1 resize-none bg-bg border-2 border-ink rounded-[var(--radius)]",
                    "text-sm text-text-base placeholder:text-subtle px-3 py-2",
                    "outline-none focus:outline-none focus:ring-0 transition-colors",
                ].join(" ")}
            />
            <button type="submit" disabled={!draft.trim()} className="btn-solid h-full shrink-0">
                <Send size={14} />
            </button>
        </form>
    );
};
