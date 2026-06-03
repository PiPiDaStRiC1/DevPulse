import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import toast from "react-hot-toast";
import type { Post } from "@shared/types";

export const useTogglePostStats = (authorId: number | undefined) => {
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
                if (error instanceof Error && error.message === "Failed to get token") {
                    toast.error("You must be logged in to like posts");
                } else {
                    toast.error("Failed to like post");
                }
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

    const { mutate: toggleBookmarkPost } = useMutation<
        void,
        Error,
        { postId: number; isBookmarked?: boolean },
        { prevPost: Post | undefined; prevPosts: Post[] | undefined }
    >({
        mutationFn: async ({ postId, isBookmarked }) => {
            try {
                if (isBookmarked) {
                    await apiClient.unbookmarkPost(postId);
                    toast.error("Post removed from bookmarks");
                } else {
                    await apiClient.bookmarkPost(postId);
                    toast.success("Post added to bookmarks");
                }
            } catch (error) {
                if (error instanceof Error && error.message === "Failed to get token") {
                    toast.error("You must be logged in to bookmark posts");
                } else {
                    toast.error("Failed to bookmark post");
                }
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
                return { ...oldData, isBookmarked: !oldData.isBookmarked };
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

    return {
        toggleLikePost,
        toggleBookmarkPost,
        isLoadingAuthor: isLoading,
        isErrorAuthor: isError,
        author,
    };
};
