import { useEffect, useState } from "react";
import { socket } from "@/lib/store";
import type { ChatOnlineAcknowledgement, SocketConnection } from "@shared/types";

export const useOnline = (userId?: number) => {
    const [isOnline, setIsOnline] = useState(false);

    useEffect(() => {
        if (!userId) return;

        socket.emit("user:online", { userId }, (res: ChatOnlineAcknowledgement) => {
            if (res.ok) {
                setIsOnline(res.data.isUserOnline);
            }
        });

        const onConnected = (payload: SocketConnection) => {
            if (payload.userId === userId) setIsOnline(true);
        };

        const onDisconnected = (payload: SocketConnection) => {
            if (payload.userId === userId) setIsOnline(false);
        };

        socket.on("user:connected", onConnected);
        socket.on("user:disconnected", onDisconnected);

        return () => {
            socket.off("user:connected", onConnected);
            socket.off("user:disconnected", onDisconnected);
        };
    }, [userId]);

    return isOnline;
};
