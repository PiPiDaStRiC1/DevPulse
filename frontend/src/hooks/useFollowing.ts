import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import toast from "react-hot-toast";
import type { User } from "@shared/types";

export const useFollowing = () => {
    const queryClient = useQueryClient();
    const {
        data: suggestedUsers,
        isLoading: isLoadingSuggested,
        isError: isErrorSuggested,
    } = useQuery<User[]>({
        queryKey: ["suggestedUsers"],
        queryFn: () => apiClient.getSuggestedUsers(),
        staleTime: 0,
    });
    const { mutate: toggleFollowUser, isPending: isPendingFollowing } = useMutation<
        User,
        Error,
        { userId: number; isFollowing: boolean },
        { previousData: User[] | undefined }
    >({
        mutationKey: ["toggleFollowUser"],
        onMutate: async ({ userId }) => {
            await queryClient.cancelQueries({ queryKey: ["suggestedUsers"] });

            const previousData = queryClient.getQueryData<unknown, string[], User[] | undefined>([
                "suggestedUsers",
            ]);

            queryClient.setQueryData<User[]>(["suggestedUsers"], (old) => {
                if (!old) return [];
                return old.map((user) =>
                    user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user,
                );
            });

            return { previousData };
        },
        mutationFn: async ({ userId, isFollowing }) => {
            try {
                if (isFollowing) {
                    const user = await apiClient.unfollowUser(userId);
                    toast.error(`Unfollowed @${user.handle}`);
                    return user;
                } else {
                    const user = await apiClient.followUser(userId);
                    toast.success(`Followed @${user.handle}`);
                    return user;
                }
            } catch (error) {
                toast.error("You must be logged in to follow users");
                throw error;
            }
        },
        onError: (_error, _variables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(["suggestedUsers"], context.previousData);
            }
        },
        onSettled: (data) => {
            queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] });
            queryClient.invalidateQueries({ queryKey: ["user", data?.handle] });
        },
    });

    return {
        suggestedUsers,
        isLoadingSuggested,
        isErrorSuggested,
        toggleFollowUser,
        isPendingFollowing,
    };
};
