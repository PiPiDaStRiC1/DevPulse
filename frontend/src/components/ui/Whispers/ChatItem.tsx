import { BadgeCheck } from "lucide-react";
import { Avatar } from "@/components";
import { NavLink } from "react-router-dom";
import { safeParseDate } from "@/lib/utils";
import { useOnline, useTypingStatus } from "@/hooks";
import Typing from "@/assets/typing.svg";
import type { Chat, User } from "@shared/types";

interface ChatItemProps {
    chat: Chat;
    user: User;
}

export const ChatItem = ({ chat, user }: ChatItemProps) => {
    const last = chat.lastMessage;
    const isOnline = useOnline(chat.collocutor.id);
    const isTyping = useTypingStatus(chat.id);

    return (
        <NavLink
            to={`/whispers/${chat.id}`}
            key={chat.id}
            className={({ isActive }) =>
                `w-full text-left px-4 py-3 flex items-center gap-3 border-b border-ink-soft cursor-pointer font-[inherit] transition-colors ${isActive ? "bg-bg border-l-2 border-l-ink" : "bg-surface hover:bg-bg border-l-2 border-l-transparent"}`
            }
        >
            <Avatar handle={chat.collocutor.handle} isOnline={isOnline} size="sm" />
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1 min-w-0">
                        <span className="text-[13px] font-bold truncate">
                            {chat.collocutor.username}
                        </span>
                        {chat.collocutor.isVerified && (
                            <BadgeCheck size={11} className="text-av-blue shrink-0" />
                        )}
                    </div>
                    <span className="text-[10px] text-subtle shrink-0">
                        {safeParseDate(last.createdAt)}
                    </span>
                </div>
                {isTyping ? (
                    <p className="flex items-center text-[12px]">
                        <img src={Typing} alt="Typing..." className="w-4 h-4" /> typing
                    </p>
                ) : (
                    <p className="text-[12px] text-muted truncate mt-0.5">
                        {last.senderId === user.id && <span className="text-subtle">You: </span>}
                        {last.text}
                    </p>
                )}
            </div>
            {chat.unreadCount > 0 && (
                <span className="text-[10px] font-bold bg-ink text-accent-fg rounded-full w-4 h-4 flex items-center justify-center shrink-0">
                    {chat.unreadCount}
                </span>
            )}
        </NavLink>
    );
};
