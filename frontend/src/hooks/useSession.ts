import { useAuthStore, selectIsAuthenticated } from "@/lib/store";

export const useSession = () => {
    const token = useAuthStore((state) => state.token);
    const user = useAuthStore((state) => state.user);
    const status = useAuthStore((state) => state.status);
    const logout = useAuthStore((state) => state.logout);
    const isHydrated = useAuthStore((state) => state.isHydrated);
    const isAuthenticated = useAuthStore(selectIsAuthenticated);

    return { token, user, status, logout, isAuthenticated, isHydrated };
};
