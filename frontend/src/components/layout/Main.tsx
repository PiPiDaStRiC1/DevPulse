import { Outlet } from "react-router-dom";

export const Main = () => {
    return (
        <main className="min-h-[calc(100vh-60px)] bg-bg flex items-start justify-center py-7">
            <div className="max-w-7xl w-full mx-auto flex items-start gap-6">
                <Outlet />
            </div>
        </main>
    );
};
