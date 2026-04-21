import { useAuthStore } from "@/lib/store";
import { apiClient } from "@/lib/api";
import { useEffect, useRef } from "react";

export const useAuthBootstrap = () => {
    const { token, isHydrated } = useAuthStore();
    const isBootstrapping = useRef(false);

    useEffect(() => {
        if (!token) {
            return useAuthStore.getState().logout();
        }

        if (isHydrated || isBootstrapping.current) {
            return;
        }

        const bootstrap = async () => {
            try {
                const user = await apiClient.me();
                useAuthStore.getState().setUser(user);
            } catch (error) {
                console.error("Failed to bootstrap auth:", error);
                useAuthStore.getState().logout();
            }
        };

        isBootstrapping.current = true;

        bootstrap();
    }, [token, isHydrated]);
};
