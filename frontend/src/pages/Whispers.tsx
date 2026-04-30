import { useState, useEffect } from "react";
import { Search, BadgeCheck, MessageCircle } from "lucide-react";
import { Avatar, ChatRoom, ErrorAlert } from "@/components";
import { CHATS } from "@/lib/constants";
import { useAuthStore } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import { parseISO } from "@/lib/utils";
import type { Chat } from "@shared/types";

export const Whispers = () => {
    const { user, status } = useAuthStore();
    const [activeId, setActiveId] = useState(1);
    const [search, setSearch] = useState("");
    const {
        data: chats,
        isLoading,
        isError,
    } = useQuery<Chat[]>({
        queryKey: ["chats"],
        queryFn: async () => {
            return CHATS;
        },
    });

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError || !chats || !user || status === "guest") {
        return <ErrorAlert message="Failed to fetch chats" />;
    }

    const active = chats.find((c) => c.id === activeId)!;
    const filtered = chats.filter(
        (c) =>
            c.collocutor.username.toLowerCase().includes(search.toLowerCase()) ||
            c.collocutor.handle.toLowerCase().includes(search.toLowerCase()),
    );

    const totalUnread = chats.reduce((n, c) => n + c.unreadCount, 0);

    return (
        <div
            className="flex-1 mt-10 min-w-0 flex border-2 border-ink rounded-[var(--radius)] overflow-hidden"
            style={{ boxShadow: "var(--shadow-card)", height: "calc(100vh - 7rem)" }}
        >
            <div className="w-[280px] shrink-0 border-r-2 border-ink bg-surface flex flex-col">
                <div className="px-4 py-3 border-b-2 border-ink flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <MessageCircle size={14} className="text-ink" />
                        <span className="text-sm font-bold tracking-tight">Whispers</span>
                    </div>
                    {totalUnread > 0 && (
                        <span className="text-[10px] font-bold bg-ink text-accent-fg rounded-full px-1.5 py-0.5 leading-none">
                            {totalUnread}
                        </span>
                    )}
                </div>

                <div className="px-3 py-2 border-b border-ink-soft">
                    <div className="flex items-center gap-2 bg-bg border border-ink-soft rounded-[var(--radius)] px-3 py-1.5">
                        <Search size={12} className="text-muted shrink-0" />
                        <input
                            type="text"
                            placeholder="Search…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="text-xs flex-1 bg-transparent outline-none border-0 text-text-base placeholder:text-subtle"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filtered.map((chat) => {
                        const last = chat.lastMessage;
                        const isActive = activeId === chat.id;

                        return (
                            <button
                                key={chat.id}
                                onClick={() => setActiveId(chat.id)}
                                className={`w-full text-left px-4 py-3 flex items-center gap-3 border-b border-ink-soft cursor-pointer font-[inherit] transition-colors ${isActive ? "bg-bg border-l-2 border-l-ink" : "bg-surface hover:bg-bg border-l-2 border-l-transparent"}`}
                            >
                                <Avatar handle={chat.collocutor.handle} size="sm" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-1">
                                        <div className="flex items-center gap-1 min-w-0">
                                            <span className="text-[13px] font-bold truncate">
                                                {chat.collocutor.username}
                                            </span>
                                            {chat.collocutor.isVerified && (
                                                <BadgeCheck
                                                    size={11}
                                                    className="text-av-blue shrink-0"
                                                />
                                            )}
                                        </div>
                                        <span className="text-[10px] text-subtle shrink-0">
                                            {parseISO(last.createdAt)}
                                        </span>
                                    </div>
                                    <p className="text-[12px] text-muted truncate mt-0.5">
                                        {last.senderId === user.id && (
                                            <span className="text-subtle">You: </span>
                                        )}
                                        {last.text}
                                    </p>
                                </div>
                                {chat.unreadCount > 0 && (
                                    <span className="text-[10px] font-bold bg-ink text-accent-fg rounded-full w-4 h-4 flex items-center justify-center shrink-0">
                                        {chat.unreadCount}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <ChatRoom activeChat={active} currentUserId={user.id} />
        </div>
    );
};
