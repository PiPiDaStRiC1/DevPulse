import { useRef, useEffect, useState } from "react";
import { ErrorAlert, ChatRoomSkeleton, ChatRoomHeader } from "@/components";
import { Send } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { safeParseDate } from "@/lib/utils";
import { useNavigate, useParams } from "react-router-dom";
import { useSession } from "@/hooks";
import { apiClient } from "@/lib/api";
import toast from "react-hot-toast";
import type { Chat, Message } from "@shared/types";

export const ChatRoom = () => {
    const { user: me } = useSession();
    const navigate = useNavigate();
    const [draft, setDraft] = useState("");
    const { id } = useParams<{ id: string }>();
    const isMe = Boolean(me?.id === id);

    const {
        data: chat,
        isLoading: isLoadingChat,
        isError: isErrorChat,
    } = useQuery<Chat>({
        queryKey: ["chats", id],
        queryFn: () => apiClient.getOneChat(Number(id!)),
        enabled: !!id,
    });

    const {
        data: chatMessages,
        isLoading: isLoadingMessages,
        isError: isErrorMessages,
        refetch: refetchMessages,
    } = useQuery<Message[]>({
        queryKey: ["messages", id!],
        queryFn: () => apiClient.getAllMessagesByChatId(Number(id!)),
        enabled: !!id,
    });
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await apiClient.postOneMessage({
                text: draft.trim(),
                senderId: me!.id,
                chatId: Number(id!),
            });
            setDraft("");
            refetchMessages();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("Failed to create message");
        }
    };

    useEffect(() => {
        if (isMe) {
            navigate(-1);
        }
    }, [isMe, navigate]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [id, chatMessages?.length]);

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
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
                {chatMessages.map((msg) => {
                    const isMyMsg = msg.senderId === me?.id;
                    return (
                        <div
                            key={msg.id}
                            className={[
                                "flex flex-col gap-1",
                                isMyMsg ? "items-end" : "items-start",
                            ].join(" ")}
                        >
                            <div
                                className={[
                                    "max-w-[72%] px-4 py-2.5 text-[13px] leading-relaxed",
                                    "border-2 border-ink rounded-[var(--radius)]",
                                    isMyMsg ? "bg-ink text-accent-fg" : "bg-surface text-text-base",
                                ].join(" ")}
                                style={isMyMsg ? undefined : { boxShadow: "2px 2px 0 var(--ink)" }}
                            >
                                {msg.text}
                            </div>
                            <span className="text-[10px] text-subtle px-1">
                                {safeParseDate(msg.createdAt)}
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
                    className="btn-solid h-full shrink-0"
                >
                    <Send size={14} />
                </button>
            </form>
        </div>
    );
};
