import { useState, useRef, useEffect } from "react";
import { Send, Search, BadgeCheck, MessageCircle } from "lucide-react";
import { Avatar } from "@/components";
import { suggestedUsers } from "@/lib/constants/mockData";
import type { SuggestedUser } from "@shared/types";

interface Message {
    id: string;
    senderId: "me" | "other";
    text: string;
    time: string;
}

interface Convo {
    id: string;
    user: SuggestedUser;
    messages: Message[];
    unread: number;
}

const CONVOS: Convo[] = [
    {
        id: "c1",
        user: suggestedUsers[2]!,
        unread: 2,
        messages: [
            {
                id: "m1",
                senderId: "other",
                text: "Hey! Saw your post about TypeScript generics — super clear explanation 🙌",
                time: "10:24",
            },
            {
                id: "m2",
                senderId: "me",
                text: "Thanks! Conditional types took me forever to grok.",
                time: "10:26",
            },
            {
                id: "m3",
                senderId: "other",
                text: "Would you mind doing a quick PR review? Nothing huge, just a refactor.",
                time: "10:31",
            },
            {
                id: "m4",
                senderId: "other",
                text: "github.com/aiko_tsx/ui-kit/pull/42",
                time: "10:31",
            },
        ],
    },
    {
        id: "c2",
        user: suggestedUsers[0]!,
        unread: 0,
        messages: [
            {
                id: "m5",
                senderId: "me",
                text: "Your dashboard redesign post was 🔥",
                time: "Yesterday",
            },
            {
                id: "m6",
                senderId: "other",
                text: "haha thanks, those 14 shades of grey were a nightmare to replace",
                time: "Yesterday",
            },
            {
                id: "m7",
                senderId: "me",
                text: "The before/after screenshots really showed the 8px grid impact",
                time: "Yesterday",
            },
            {
                id: "m8",
                senderId: "other",
                text: "Exactly! Visual hierarchy makes such a difference in UX scores",
                time: "Yesterday",
            },
        ],
    },
    {
        id: "c3",
        user: suggestedUsers[1]!,
        unread: 1,
        messages: [
            {
                id: "m9",
                senderId: "other",
                text: "ok but Rust ownership model is just chef's kiss",
                time: "Mon",
            },
            {
                id: "m10",
                senderId: "me",
                text: "Once it clicks it's amazing. Took me ~3 weeks 😅",
                time: "Mon",
            },
            {
                id: "m11",
                senderId: "other",
                text: "Worth every borrow checker error lol",
                time: "Mon",
            },
        ],
    },
];

export const Whispers = () => {
    const [activeId, setActiveId] = useState<string>("c1");
    const [draft, setDraft] = useState("");
    const [search, setSearch] = useState("");
    const [convos, setConvos] = useState<Convo[]>(CONVOS);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const active = convos.find((c) => c.id === activeId)!;

    const handleSend = () => {
        const text = draft.trim();
        if (!text) return;
        setConvos((prev) =>
            prev.map((c) =>
                c.id === activeId
                    ? {
                          ...c,
                          messages: [
                              ...c.messages,
                              { id: `m${Date.now()}`, senderId: "me", text, time: "now" },
                          ],
                      }
                    : c,
            ),
        );
        setDraft("");
    };

    const filtered = convos.filter(
        (c) =>
            c.user.username.toLowerCase().includes(search.toLowerCase()) ||
            c.user.handle.toLowerCase().includes(search.toLowerCase()),
    );

    const totalUnread = convos.reduce((n, c) => n + c.unread, 0);

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeId, active.messages.length]);

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
                    {filtered.map((convo) => {
                        const last = convo.messages.at(-1);
                        const isActive = activeId === convo.id;
                        return (
                            <button
                                key={convo.id}
                                onClick={() => setActiveId(convo.id)}
                                className={`w-full text-left px-4 py-3 flex items-center gap-3 border-b border-ink-soft cursor-pointer font-[inherit] transition-colors ${isActive ? "bg-bg border-l-2 border-l-ink" : "bg-surface hover:bg-bg border-l-2 border-l-transparent"}`}
                            >
                                <Avatar handle={convo.user.handle} size="sm" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-1">
                                        <div className="flex items-center gap-1 min-w-0">
                                            <span className="text-[13px] font-bold truncate">
                                                {convo.user.username}
                                            </span>
                                            {convo.user.isVerified && (
                                                <BadgeCheck
                                                    size={11}
                                                    className="text-av-blue shrink-0"
                                                />
                                            )}
                                        </div>
                                        <span className="text-[10px] text-subtle shrink-0">
                                            {last?.time}
                                        </span>
                                    </div>
                                    <p className="text-[12px] text-muted truncate mt-0.5">
                                        {last?.senderId === "me" && (
                                            <span className="text-subtle">You: </span>
                                        )}
                                        {last?.text}
                                    </p>
                                </div>
                                {convo.unread > 0 && (
                                    <span className="text-[10px] font-bold bg-ink text-accent-fg rounded-full w-4 h-4 flex items-center justify-center shrink-0">
                                        {convo.unread}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex-1 flex flex-col bg-bg min-w-0">
                <div className="px-5 py-3 border-b-2 border-ink bg-surface flex items-center gap-3 shrink-0">
                    <Avatar handle={active.user.handle} size="md" />
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[14px] font-bold leading-tight truncate">
                                {active.user.username}
                            </span>
                            {active.user.isVerified && (
                                <BadgeCheck size={13} className="text-av-blue shrink-0" />
                            )}
                        </div>
                        <p className="text-[11px] text-muted">
                            @{active.user.handle} · {active.user.role}
                        </p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
                    {active.messages.map((msg) => {
                        const isMe = msg.senderId === "me";
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
                                        isMe
                                            ? "bg-ink text-accent-fg"
                                            : "bg-surface text-text-base",
                                    ].join(" ")}
                                    style={isMe ? undefined : { boxShadow: "2px 2px 0 var(--ink)" }}
                                >
                                    {msg.text}
                                </div>
                                <span className="text-[10px] text-subtle px-1">{msg.time}</span>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                <div className="px-4 py-3 border-t-2 border-ink bg-surface shrink-0 flex items-end gap-3">
                    <textarea
                        rows={1}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Whisper something…"
                        className={[
                            "flex-1 resize-none bg-bg border-2 border-ink rounded-[var(--radius)]",
                            "text-sm text-text-base placeholder:text-subtle px-3 py-2",
                            "outline-none focus:outline-none focus:ring-0 transition-colors",
                        ].join(" ")}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!draft.trim()}
                        className="btn-solid !py-2 !px-3 shrink-0"
                    >
                        <Send size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};
