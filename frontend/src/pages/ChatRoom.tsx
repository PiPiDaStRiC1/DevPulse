import { useRef, useEffect, useState } from "react";
import { Avatar, ErrorAlert, ChatRoomSkeleton } from "@/components";
import { BadgeCheck, Send } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { MESSAGES } from "@/lib/constants";
import { parseISO } from "@/lib/utils";
import { Link, useParams } from "react-router-dom";
import { CHATS } from "@/lib/constants";
import { useSession } from "@/hooks";
import type { Chat, Message } from "@shared/types";

export const ChatRoom = () => {
    const [draft, setDraft] = useState("");
    const { user } = useSession();
    const { id } = useParams<{ id: string }>();

    const activeChat = CHATS.find((c) => c.id === Number(id))!;

    const {
        data: chatMessages,
        isLoading: isLoadingMessages,
        isError: isErrorMessages,
    } = useQuery<Message[]>({
        queryKey: ["messages", id!],
        queryFn: async () => {
            return MESSAGES.filter((mess) => mess.chatId === Number(id!));
        },
    });
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setDraft("");
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [id, chatMessages?.length]);

    if (isLoadingMessages) {
        return <ChatRoomSkeleton />;
    }

    if (isErrorMessages) {
        return <ErrorAlert message="Failed to load messages" />;
    }

    if (!chatMessages) {
        return <ErrorAlert message="Not found" />;
    }

    return (
        <div className="flex-1 flex flex-col bg-bg min-w-0">
            <div className="px-5 py-3 border-b-2 border-ink bg-surface flex items-center gap-3 shrink-0">
                <Link
                    to={`/profile/${activeChat.collocutor.handle}`}
                    className="flex items-center gap-3"
                >
                    <Avatar handle={activeChat.collocutor.handle} size="md" />
                </Link>
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
                    const isMe = msg.senderId === user?.id;
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
