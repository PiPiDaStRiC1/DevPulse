import { useAuthStore } from "@/lib/store";
import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

interface PublicRouteProps {
    children: ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
    const location = useLocation();
    const locationState = location.state as { background?: Location; from?: string };
    const redirectTo = locationState?.from || locationState?.background?.pathname || "/profile";
    const { status } = useAuthStore();

    if (status === "authenticated") {
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
};
