import { useAuthStore } from "@/lib/store";
import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
    children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const location = useLocation();
    const locationState = location.state as { background?: Location; from?: string } | undefined;
    const { status } = useAuthStore();

    if (status === "unknown") {
        return null;
    }

    if (status === "guest") {
        const background = locationState?.background || location.pathname;

        return (
            <Navigate
                to="/auth"
                state={{ background: background, from: location.pathname }}
                replace
            />
        );
    }

    return <>{children}</>;
};
