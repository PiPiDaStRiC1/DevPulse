import { useEffect, useMemo, useRef } from "react";
import { useChat } from "@/hooks";
import { ErrorAlert, ChatRoomSkeleton, ChatRoomHeader } from "@/components";
import { Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { safeParseDate } from "@/lib/utils";

export const ChatRoom = () => {
    const {
        me,
        isMe,
        chatId,
        chat,
        isLoadingChat,
        isErrorChat,
        chatMessages,
        isLoadingMessages,
        isErrorMessages,
        draft,
        setDraft,
        handleSubmit,
        readChat,
        messagesContainerRef,
    } = useChat();
    const navigate = useNavigate();
    const unreadMarkerRef = useRef<HTMLDivElement>(null);
    const chatBottomRef = useRef<HTMLDivElement>(null);

    const unreadStartIndex = useMemo(() => {
        if (!chat || !chatMessages) return -1;

        return chatMessages.findIndex(
            (msg) => msg.senderId !== me?.id && msg.createdAt > chat.lastReadAt,
        );
    }, [chat, chatMessages, me?.id]);

    useEffect(() => {
        if (isMe) {
            navigate(-1);
        }
    }, [isMe, navigate]);

    // if we have unread messages - scroll to unread modal, either to the end
    useEffect(() => {
        const container = messagesContainerRef.current;
        const marker = unreadMarkerRef.current;
        if (!container) return;

        if (marker) {
            marker.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }, [chatId, chatMessages?.length, messagesContainerRef]);

    useEffect(() => {
        if (!chat || !chatMessages || unreadStartIndex === -1) return;

        const container = messagesContainerRef.current;
        const bottomSentinel = chatBottomRef.current;

        if (!container || !bottomSentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    readChat(Number(chatId));
                    observer.disconnect();
                }
            },
            { root: container, threshold: 1.0 },
        );

        observer.observe(bottomSentinel);

        return () => observer.disconnect();
    }, [chat, chatId, chatMessages, messagesContainerRef, readChat, unreadStartIndex]);

    if (isLoadingMessages || isLoadingChat) {
        return <ChatRoomSkeleton />;
    }

    if (isErrorMessages || isErrorChat) {
        return <ErrorAlert message="Failed to load messages" />;
    }

    if (!chatMessages || !chat) {
        return <ErrorAlert message="Messages not found" />;
    }

    return (
        <div className="flex-1 flex flex-col bg-bg min-w-0">
            <ChatRoomHeader chat={chat} />
            <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3"
            >
                {chatMessages.map((msg, index) => {
                    const isMyMsg = msg.senderId === me?.id;
                    const showUnreadMarker = index === unreadStartIndex && chat.unreadCount > 0;

                    return (
                        <div key={msg.id} className="flex flex-col gap-3">
                            {showUnreadMarker && (
                                <div
                                    ref={unreadMarkerRef}
                                    className="flex justify-center items-center w-full bg-ink rounded-sm"
                                >
                                    <p className="text-white text-xs">
                                        {chat.unreadCount === 1
                                            ? "1 unread message"
                                            : `${chat.unreadCount} unread messages`}
                                    </p>
                                </div>
                            )}
                            <div
                                className={[
                                    "flex flex-col gap-1",
                                    isMyMsg ? "items-end" : "items-start",
                                ].join(" ")}
                            >
                                <div
                                    className={[
                                        "max-w-[72%] px-4 py-2.5 text-[13px] leading-relaxed",
                                        "border-2 border-ink rounded-[var(--radius)]",
                                        isMyMsg
                                            ? "bg-ink text-accent-fg"
                                            : "bg-surface text-text-base",
                                    ].join(" ")}
                                    style={
                                        isMyMsg ? undefined : { boxShadow: "2px 2px 0 var(--ink)" }
                                    }
                                >
                                    {msg.text}
                                </div>
                                <span className="text-[10px] text-subtle px-1">
                                    {safeParseDate(msg.createdAt)}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={chatBottomRef} className="h-px w-full" aria-hidden="true" />
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
                    className="btn-solid h-full shrink-0"
                >
                    <Send size={14} />
                </button>
            </form>
        </div>
    );
};
