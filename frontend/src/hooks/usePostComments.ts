import { apiClient } from "@/lib/api";
import { socket } from "@/lib/store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSocket } from "@/hooks";
import type { Comment, Post, SocketCommentPayload } from "@shared/types";

export const usePostComments = (postId: number) => {
    const queryClient = useQueryClient();
    const { publishCommentWithWS } = useSocket();
    const [body, setBody] = useState("");

    const {
        data: comments,
        isLoading: isLoadingComments,
        isError: isErrorComments,
    } = useQuery<Comment[]>({
        queryKey: ["posts", postId, "comments"],
        queryFn: () => apiClient.getAllCommentsByPostId(postId),
        enabled: !!postId,
        staleTime: 5 * 60 * 1000,
    });

    const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const newComment = await apiClient.postComment({ postId, text: body });

            queryClient.setQueryData(
                ["posts", postId, "comments"],
                (oldData: Comment[] | undefined) => {
                    if (!oldData) return [newComment];
                    return [newComment, ...oldData];
                },
            );
            queryClient.setQueryData(["posts", postId], (oldData: Post | undefined) => {
                if (!oldData) return oldData;
                return { ...oldData, comments: oldData.comments + 1 };
            });

            publishCommentWithWS({ comment: newComment });

            setBody("");
        } catch (error) {
            console.error("Failed to create post", error);
            if (error instanceof Error) {
                toast.error(error.message || "Failed to create post");
            }
        }
    };

    useEffect(() => {
        const handler = (payload: SocketCommentPayload) => {
            queryClient.setQueryData(
                ["posts", postId, "comments"],
                (oldData: Comment[] | undefined) => {
                    if (!oldData) return [payload.comment];
                    return [payload.comment, ...oldData];
                },
            );
            queryClient.setQueryData(["posts", postId], (oldData: Post | undefined) => {
                if (!oldData) return oldData;
                return { ...oldData, comments: oldData.comments + 1 };
            });
        };

        socket.on("comment:publish:new", handler);

        return () => {
            socket.off("comment:publish:new", handler);
        };
    }, [queryClient, postId]);

    return { comments, isLoadingComments, isErrorComments, handleCommentSubmit, body, setBody };
};
