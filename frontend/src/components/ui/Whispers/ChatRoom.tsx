import { useRef, useEffect, useState } from "react";
import { Avatar, ErrorAlert, ChatRoomSkeleton } from "@/components";
import { BadgeCheck, Send } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { MESSAGES } from "@/lib/constants";
import { parseISO } from "@/lib/utils";
import type { Chat, Message } from "@shared/types";

interface ChatRoomProps {
    activeChat: Chat;
    currentUserId: number;
}

export const ChatRoom = ({ activeChat, currentUserId }: ChatRoomProps) => {
    const [draft, setDraft] = useState("");
    const {
        data: chatMessages,
        isLoading: isLoadingMessages,
        isError: isErrorMessages,
    } = useQuery<Message[]>({
        queryKey: ["messages", activeChat.id],
        queryFn: async () => {
            return MESSAGES.filter((mess) => mess.chatId === activeChat.id);
        },
    });
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleSubmit = () => {
        setDraft("");
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeChat.id, chatMessages?.length]);

    if (isLoadingMessages) {
        return <ChatRoomSkeleton />;
    }

    if (isErrorMessages || !chatMessages) {
        return <ErrorAlert message="Failed to load messages" />;
    }

    return (
        <div className="flex-1 flex flex-col bg-bg min-w-0">
            <div className="px-5 py-3 border-b-2 border-ink bg-surface flex items-center gap-3 shrink-0">
                <Avatar handle={activeChat.collocutor.handle} size="md" />
                <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[14px] font-bold leading-tight truncate">
                            {activeChat.collocutor.username}
                        </span>
                        {activeChat.collocutor.isVerified && (
                            <BadgeCheck size={13} className="text-av-blue shrink-0" />
                        )}
                    </div>
                    <p className="text-[11px] text-muted">@{activeChat.collocutor.handle}</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
                {chatMessages.map((msg) => {
                    const isMe = msg.senderId === currentUserId;
                    return (
                        <div
                            key={msg.id}
                            className={[
                                "flex flex-col gap-1",
                                isMe ? "items-end" : "items-start",
                            ].join(" ")}
                        >
                            <div
                                className={[
                                    "max-w-[72%] px-4 py-2.5 text-[13px] leading-relaxed",
                                    "border-2 border-ink rounded-[var(--radius)]",
                                    isMe ? "bg-ink text-accent-fg" : "bg-surface text-text-base",
                                ].join(" ")}
                                style={isMe ? undefined : { boxShadow: "2px 2px 0 var(--ink)" }}
                            >
                                {msg.text}
                            </div>
                            <span className="text-[10px] text-subtle px-1">
                                {parseISO(msg.createdAt)}
                            </span>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

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
                <button
                    type="submit"
                    disabled={!draft.trim()}
                    className="btn-solid !py-2 !px-3 shrink-0"
                >
                    <Send size={14} />
                </button>
            </form>
        </div>
    );
};
