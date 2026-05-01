import { BadgeCheck, CalendarDays, Edit3, Mail, Shield, UserRound, LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { ErrorAlert, Preloader } from "@/components/common";
import { useSession } from "@/hooks";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { safeParseDate } from "@/lib/utils";
import type { User } from "@shared/types";

export const MyProfile = () => {
    const navigate = useNavigate();
    const { logout } = useSession();

    const {
        data: currentUser,
        isLoading,
        isError,
        refetch,
    } = useQuery<User>({ queryKey: ["me"], queryFn: apiClient.me, staleTime: 30 * 1000 });

    const handleLogout = () => {
        navigate("/");

        setTimeout(() => {
            logout();
            toast.success("Logged out successfully!");
        }, 200);
    };

    if (isLoading) {
        return (
            <section className="flex h-full w-full justify-center items-center">
                <Preloader text="Loading profile" />
            </section>
        );
    }

    if (isError || !currentUser) {
        return (
            <section className="flex h-full w-full justify-center items-center">
                <ErrorAlert
                    message={isError ? "We couldn't load your account data." : "Profile not found."}
                    onRetry={refetch}
                />
            </section>
        );
    }

    const profileHighlights = [
        { label: "Posts", value: 12 },
        { label: "Followers", value: currentUser.followers },
        { label: "Following", value: currentUser.following },
        { label: "Saved", value: 7 },
    ];

    const accountFacts = [
        { icon: Mail, label: "Email", value: currentUser.email },
        { icon: UserRound, label: "Handle", value: currentUser.handle },
        { icon: Shield, label: "Role", value: currentUser.role },
        { icon: CalendarDays, label: "Joined", value: safeParseDate(currentUser.createdAt) },
    ];

    const initials = currentUser.username
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <section className="flex-1 min-w-0">
            <div className="flex flex-col gap-5">
                <div className="card p-5 sm:p-6 lg:p-7">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div
                                    className="sq-avatar w-16 h-16 text-xl"
                                    style={{ background: "var(--ink)", color: "var(--accent-fg)" }}
                                >
                                    {initials}
                                </div>

                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-base">
                                            {currentUser.username}
                                        </h1>
                                        {currentUser.isVerified && (
                                            <span className="inline-flex items-center gap-1 border border-ink rounded-[var(--radius)] px-2 py-0.5 text-[12px] font-semibold">
                                                <BadgeCheck size={12} /> Verified
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-sm text-muted font-semibold mt-1">
                                        @{currentUser.handle}
                                    </p>
                                    <p className="text-sm text-muted mt-3 max-w-2xl leading-relaxed">
                                        {currentUser.bio ||
                                            "Add a short bio to tell others what you build."}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <button className="btn-outline w-fit">
                                    <Edit3 size={15} /> Edit profile
                                </button>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="btn-outline w-full justify-center"
                                >
                                    <LogOut size={14} /> Log out
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {profileHighlights.map((item) => (
                                <div key={item.label} className="filter-card py-3 px-4">
                                    <p className="text-[11px] uppercase tracking-wider text-subtle font-bold">
                                        {item.label}
                                    </p>
                                    <p className="text-xl font-extrabold tracking-tight text-text-base mt-1">
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <article className="card p-5 lg:col-span-2">
                        <div className="flex items-center justify-between gap-3 mb-4">
                            <h2 className="text-lg font-bold tracking-tight">Activity Overview</h2>
                            <span className="text-xs text-subtle">Last 30 days</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                            <div className="filter-card px-4 py-3">
                                <p className="text-[12px] text-subtle font-semibold">
                                    Published posts
                                </p>
                                <p className="text-2xl font-extrabold tracking-tight mt-1">4</p>
                            </div>
                            <div className="filter-card px-4 py-3">
                                <p className="text-[12px] text-subtle font-semibold">
                                    Total reactions
                                </p>
                                <p className="text-2xl font-extrabold tracking-tight mt-1">321</p>
                            </div>
                            <div className="filter-card px-4 py-3">
                                <p className="text-[12px] text-subtle font-semibold">
                                    Comments written
                                </p>
                                <p className="text-2xl font-extrabold tracking-tight mt-1">27</p>
                            </div>
                        </div>

                        <p className="text-[14px] leading-relaxed text-muted">
                            Keep your profile updated so other developers can quickly understand
                            your focus area, current stack, and what kind of discussions you enjoy.
                        </p>
                    </article>

                    <aside className="card p-5">
                        <h2 className="text-lg font-bold tracking-tight mb-4">Account Details</h2>
                        <ul className="flex flex-col gap-3">
                            {accountFacts.map(({ icon: Icon, label, value }) => (
                                <li key={label} className="filter-card px-3 py-2.5">
                                    <p className="text-[11px] uppercase tracking-wide text-subtle font-bold flex items-center gap-1.5">
                                        <Icon size={12} /> {label}
                                    </p>
                                    <p className="text-[14px] font-semibold text-text-base mt-1 break-words">
                                        {value}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </aside>
                </div>
            </div>
        </section>
    );
};
