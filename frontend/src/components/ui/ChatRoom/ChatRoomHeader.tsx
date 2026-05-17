import { Link } from "react-router-dom";
import { BadgeCheck } from "lucide-react";
import { Avatar, Preloader, ErrorAlert } from "@/components";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { socket } from "@/lib/store";
import { useEffect, useState } from "react";
import type { ChatOnlineAcknowledgement, Chat, SocketConnection } from "@shared/types";

interface ChatRoomHeaderProps {
    chat?: Chat;
    handle?: string;
}

export const ChatRoomHeader = ({ chat, handle }: ChatRoomHeaderProps) => {
    const [isOnline, setIsOnline] = useState(false);
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

    const user = collocutorFromChat ?? fetchedUser ?? null;

    useEffect(() => {
        if (!user?.id) return;

        socket.emit("user:online", { userId: user.id }, (res: ChatOnlineAcknowledgement) => {
            if (res.ok) {
                const isUserOnline = res.data.isUserOnline;
                if (isUserOnline) {
                    setIsOnline(true);
                }
            }
        });

        const onConnected = ({ userId }: SocketConnection) => {
            if (userId === user.id) setIsOnline(true);
        };

        const onDisconnected = ({ userId }: SocketConnection) => {
            if (userId === user.id) setIsOnline(false);
        };

        socket.on("user:connected", onConnected);
        socket.on("user:disconnected", onDisconnected);

        return () => {
            socket.off("user:connected", onConnected);
            socket.off("user:disconnected", onDisconnected);
        };
    }, [user?.id]);

    if (isLoading) {
        return <Preloader text="Loading user" />;
    }

    if (isError) {
        return <ErrorAlert message="Failed to load user" />;
    }

    if (!user) {
        return <ErrorAlert message="User not found" />;
    }

    return (
        <div className="px-5 py-3 border-b-2 border-ink bg-surface flex items-center gap-3 shrink-0">
            <Link to={`/profile/${user.handle}`} className="flex items-center gap-3">
                <Avatar handle={user.handle} size="md" />
            </Link>
            <div className="min-w-0">
                <div className="flex items-center">
                    <div className="flex flex-col items-start">
                        <span className="text-[14px] font-bold leading-tight truncate">
                            {user.username}
                        </span>
                        {isOnline ? (
                            <p className="flex items-center text-xs gap-1">
                                <span className="text-green-500">●</span>
                                <span className="text-gray-500">В сети</span>
                            </p>
                        ) : (
                            <p className="flex items-center text-xs gap-1">
                                <span className="text-gray-500">●</span>
                                <span className="text-gray-500">Был недавно</span>
                            </p>
                        )}
                    </div>
                    {user.isVerified && <BadgeCheck size={13} className="text-av-blue shrink-0" />}
                </div>
            </div>
        </div>
    );
};
