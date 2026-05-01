import { Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { apiClient } from "@/lib/api";
import { ErrorAlert, Preloader } from "@/components";

interface NewChatRouteProps {
    children: ReactNode;
}

export const NewChatRoute = ({ children }: NewChatRouteProps) => {
    const { handle } = useParams<{ handle: string }>();
    const {
        data: chats,
        isLoading,
        isError,
    } = useQuery({ queryKey: ["chats"], queryFn: apiClient.getAllChats });

    const chat = chats?.find((c) => c.collocutor.handle === handle);

    if (isLoading) {
        return <Preloader />;
    }

    if (isError) {
        return <ErrorAlert message="Failed to fetch chat" />;
    }

    if (chat) {
        return <Navigate to={`/whispers/${chat.id}`} replace />;
    }

    return <>{children}</>;
};
