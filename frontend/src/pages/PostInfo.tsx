import { apiClient } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export const PostInfo = () => {
    const { postId } = useParams<{ postId: string }>();
    const {
        data: post,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["post", postId],
        queryFn: () => apiClient.getOnePost(Number(postId!)),
        enabled: !!postId,
        staleTime: 5 * 60 * 1000,
    });

    return <div></div>;
};
