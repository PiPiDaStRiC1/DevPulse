import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@shared/types";

type AuthStatus = "unknown" | "authenticated" | "guest";

interface AuthState {
    token: string | null;
    user: User | null;
    status: AuthStatus;
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
            setAuth: ({ token, user }) => {
                set({ token, user, status: "authenticated" });
            },
            setUser: (user) => {
                set((state) => ({ user, status: state.token ? "authenticated" : "guest" }));
            },
            logout: () => {
                set({ token: null, user: null, status: "guest" });
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
                };
            },
        },
    ),
);

export const selectIsAuthenticated = (state: AuthState) => state.status === "authenticated";

export const getAuthToken = () => useAuthStore.getState().token;
