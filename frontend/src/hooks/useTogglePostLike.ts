import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import toast from "react-hot-toast";
import type { Post } from "@shared/types";

export const useTogglePostLike = (authorId: number | undefined) => {
    const queryClient = useQueryClient();

    const {
        data: author,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["user", authorId],
        queryFn: () => apiClient.getOneUserById(authorId!),
        staleTime: 30 * 60 * 1000,
        enabled: !!authorId,
    });

    const { mutate: toggleLikePost } = useMutation<
        void,
        Error,
        { postId: number; isLiked?: boolean },
        { prevPost: Post | undefined; prevPosts: Post[] | undefined }
    >({
        mutationFn: async ({ postId, isLiked }) => {
            try {
                if (isLiked) {
                    await apiClient.dislikePost(postId);
                } else {
                    await apiClient.likePost(postId);
                }
            } catch (error) {
                toast.error("Failed to like");
                throw error;
            }
        },
        onMutate: ({ postId }) => {
            queryClient.cancelQueries({ queryKey: ["posts"] });
            queryClient.cancelQueries({ queryKey: ["posts", postId] });

            const prevPosts = queryClient.getQueryData<unknown, (string | number)[], Post[]>([
                "posts",
            ]);
            const prevPost = queryClient.getQueryData<unknown, (string | number)[], Post>([
                "posts",
                postId,
            ]);

            queryClient.setQueryData(["posts", postId], (oldData: Post | undefined) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    likes: oldData.isLiked ? oldData.likes - 1 : oldData.likes + 1,
                    isLiked: !oldData.isLiked,
                };
            });

            return { prevPosts, prevPost };
        },
        onError: (_err, { postId }, context) => {
            if (context?.prevPosts) {
                queryClient.setQueryData(["posts"], context.prevPosts);
            }
            if (context?.prevPost) {
                queryClient.setQueryData(["posts", postId], context.prevPost);
            }
        },
        onSuccess: (_data, { postId }) => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.invalidateQueries({ queryKey: ["posts", postId] });
        },
    });

    return { toggleLikePost, isLoadingAuthor: isLoading, isErrorAuthor: isError, author };
};
