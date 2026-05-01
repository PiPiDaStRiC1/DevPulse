import { useAuthStore } from "@/lib/store";
import { apiClient } from "@/lib/api";
import { useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const parseJwt = (token: string): { exp: number } | null => {
    try {
        const payload = token.split(".")[1];
        if (!payload) return null;

        const decoded = JSON.parse(atob(payload));
        return decoded;

        // eslint-disable-next-line
    } catch (error) {
        return null;
    }
};

export const useAuthBootstrap = () => {
    const { token, isHydrated, logout } = useAuthStore();
    const navigate = useNavigate();
    const isBootstrappingRef = useRef(false);
    const timerForExpiredTokenRef = useRef<number | undefined>(undefined);

    const setTimerForToken = useCallback(
        (token: string | null) => {
            if (timerForExpiredTokenRef.current) {
                clearTimeout(timerForExpiredTokenRef.current);
                timerForExpiredTokenRef.current = undefined;
            }

            if (!token) return;

            const decoded = parseJwt(token);

            if (!decoded) return;

            const expirationTime = decoded.exp * 1000;

            const timeUntilExpired = expirationTime - Date.now();

            if (timeUntilExpired > 0) {
                timerForExpiredTokenRef.current = setTimeout(() => {
                    logout();
                    toast.error("Session expired");
                    navigate("/", { replace: true });
                }, timeUntilExpired);
            } else {
                logout();
            }
        },
        [logout, navigate],
    );

    useEffect(() => {
        setTimerForToken(token);
    }, [token, setTimerForToken]);

    useEffect(() => {
        return () => {
            if (timerForExpiredTokenRef.current) {
                clearTimeout(timerForExpiredTokenRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!token) {
            return useAuthStore.getState().logout();
        }

        if (isHydrated || isBootstrappingRef.current) {
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

        isBootstrappingRef.current = true;

        bootstrap();
    }, [token, isHydrated]);
};
