import { Outlet } from "react-router-dom";

export const Main = () => {
    return (
        <main className="min-h-screen py-7 bg-bg flex items-center justify-center">
            <div className="max-w-7xl w-full mx-auto flex items-start gap-6">
                <Outlet />
            </div>
        </main>
    );
};
