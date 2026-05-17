import { socket } from "@/lib/store";
import { useEffect, useState } from "react";
import type { SocketTypingMessagePayload } from "@shared/types";

export const useTypingStatus = (chatId?: number | string) => {
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (!chatId) return;

        const handleTypingStatus = (payload: SocketTypingMessagePayload) => {
            if (String(payload.chatId) === String(chatId)) {
                setIsTyping(payload.isTyping);
            }
        };

        socket.on("user:typing:new", handleTypingStatus);

        return () => {
            socket.off("user:typing:new", handleTypingStatus);
        };
    }, [chatId]);

    return isTyping;
};
