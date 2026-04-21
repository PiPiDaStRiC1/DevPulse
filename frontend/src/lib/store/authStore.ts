import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@shared/types";

type AuthStatus = "unknown" | "authenticated" | "guest";

interface AuthState {
    token: string | null;
    user: User | null;
    status: AuthStatus;
    isHydrated: boolean;
    setAuth: (payload: { token: string; user: User }) => void;
    setUser: (user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            status: "unknown",
            isHydrated: false,
            setAuth: ({ token, user }) => {
                set({ token, user, status: "authenticated", isHydrated: true });
            },
            setHydrated: (hydrated: boolean) => {
                set({ isHydrated: hydrated });
            },
            setUser: (user) => {
                set((state) => ({
                    user,
                    status: state.token ? "authenticated" : "guest",
                    isHydrated: true,
                }));
            },
            logout: () => {
                set({ token: null, user: null, status: "guest", isHydrated: true });
            },
        }),
        {
            name: "session",
            storage: createJSONStorage(() => localStorage),
            // Persist only JWT; user/session flags should be restored from API (/auth/me).
            partialize: (state) => ({ token: state.token }),
            merge: (persistedState, currentState) => {
                const persisted = persistedState as Partial<AuthState>;

                return {
                    ...currentState,
                    token: persisted.token ?? null,
                    user: null,
                    status: "unknown",
                    isHydrated: false,
                };
            },
        },
    ),
);

export const selectIsAuthenticated = (state: AuthState) => state.status === "authenticated";

export const getAuthToken = () => useAuthStore.getState().token;
