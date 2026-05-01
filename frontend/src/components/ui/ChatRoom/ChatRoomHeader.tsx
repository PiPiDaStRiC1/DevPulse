import { Link } from "react-router-dom";
import { BadgeCheck } from "lucide-react";
import { Avatar, Preloader, ErrorAlert } from "@/components";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { Chat } from "@shared/types";

interface ChatRoomHeaderProps {
    chat?: Chat;
    handle?: string;
}

export const ChatRoomHeader = ({ chat, handle }: ChatRoomHeaderProps) => {
    const collocutorFromChat = chat?.collocutor ?? null;

    const shouldFetch = !collocutorFromChat && !!handle;

    const {
        data: fetchedUser,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["userByHandle", handle],
        queryFn: () => apiClient.getOneUserByHandle(handle!),
        enabled: shouldFetch,
        staleTime: 5 * 60 * 1000,
    });

    if (isLoading) {
        return <Preloader text="Loading user" />;
    }

    if (isError) {
        return <ErrorAlert message="Failed to load user" />;
    }

    const user = collocutorFromChat ?? fetchedUser ?? null;

    if (!user) {
        return <ErrorAlert message="User not found" />;
    }

    return (
        <div className="px-5 py-3 border-b-2 border-ink bg-surface flex items-center gap-3 shrink-0">
            <Link to={`/profile/${user.handle}`} className="flex items-center gap-3">
                <Avatar handle={user.handle} size="md" />
            </Link>
            <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                    <span className="text-[14px] font-bold leading-tight truncate">
                        {user.username}
                    </span>
                    {user.isVerified && <BadgeCheck size={13} className="text-av-blue shrink-0" />}
                </div>
                <p className="text-[11px] text-muted">@{user.handle}</p>
            </div>
        </div>
    );
};
