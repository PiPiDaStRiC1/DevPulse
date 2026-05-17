import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { useSocket } from "@/hooks";

interface ChatInputProps {
    chatId: string;
    onSendMessage: (message: string) => void;
}

export const ChatInput = ({ chatId, onSendMessage }: ChatInputProps) => {
    const { sendTypingStatusWithWS } = useSocket();
    const [draft, setDraft] = useState("");
    const timerRef = useRef<number | null>(null);
    const isTypingRef = useRef<boolean>(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSendMessage(draft);

        if (timerRef.current) clearTimeout(timerRef.current);
        sendTypingStatusWithWS({ chatId, isTyping: false });
        isTypingRef.current = false;

        setDraft("");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDraft(e.target.value);

        if (e.target.value.trim() === "") {
            if (timerRef.current) clearTimeout(timerRef.current);
            sendTypingStatusWithWS({ chatId, isTyping: false });
            isTypingRef.current = false;
            return;
        }

        if (!isTypingRef.current) {
            sendTypingStatusWithWS({ chatId, isTyping: true });
            isTypingRef.current = true;
        }

        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            sendTypingStatusWithWS({ chatId, isTyping: false });
            isTypingRef.current = false;
        }, 2000);
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    return (
        <form
            onSubmit={handleSubmit}
            className="px-4 py-3 border-t-2 border-ink bg-surface shrink-0 flex items-end gap-3"
        >
            <input
                value={draft}
                onChange={handleChange}
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
