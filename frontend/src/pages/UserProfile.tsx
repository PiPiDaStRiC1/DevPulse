import {
    BadgeCheck,
    CalendarDays,
    ExternalLink,
    Facebook,
    Mail,
    Send,
    Twitter,
    Github,
    Shield,
    UserRound,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, ErrorAlert, Preloader } from "@/components";
import { apiClient } from "@/lib/api";
import { safeParseDate } from "@/lib/utils";
import { Link, useParams } from "react-router-dom";
import { useSession } from "@/hooks";
import type { User } from "@shared/types";

export const UserProfile = () => {
    const { user: me } = useSession();
    const { handle } = useParams<{ handle: string }>();

    const {
        data: user,
        isLoading,
        isError,
    } = useQuery<User>({
        queryKey: ["user", handle],
        queryFn: () => apiClient.getOneUserByHandle(handle!),
        staleTime: 30 * 60 * 1000,
    });
    const isMe = Boolean(me?.id === user?.id);

    if (isLoading) {
        return <Preloader text="Loading profile" />;
    }

    if (isError) {
        return <ErrorAlert message="We couldn't load this profile" />;
    }

    if (!user) {
        return <ErrorAlert message="Profile not found" />;
    }

    const accountFacts = [
        { icon: Mail, label: "Email", value: user.email },
        { icon: UserRound, label: "Handle", value: user.handle },
        { icon: Shield, label: "Role", value: user.role },
        { icon: CalendarDays, label: "Joined", value: safeParseDate(user.createdAt) },
    ];

    const profileMetrics = [
        { label: "Followers", value: user.followers },
        { label: "Following", value: user.following },
        { label: "Posts", value: "—" },
        { label: "Status", value: user.isVerified ? "Verified" : "Rising" },
    ];

    const socialLinks = [
        { icon: Github, label: "GitHub", href: "#" },
        { icon: Twitter, label: "X", href: "#" },
        { icon: Facebook, label: "Facebook", href: "#" },
    ];

    return (
        <section className="flex-1 min-w-0">
            <div className="overflow-hidden rounded-[6px] border-2 border-ink bg-surface shadow-[6px_6px_0_var(--ink)]">
                <div className="relative h-[180px] sm:h-[240px] border-b-2 border-ink bg-[linear-gradient(135deg,rgba(227,214,180,0.95),rgba(206,191,152,0.85),rgba(244,237,221,0.72)),radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35),transparent_24%),radial-gradient(circle_at_75%_40%,rgba(101,92,74,0.28),transparent_20%),linear-gradient(180deg,rgba(255,255,255,0.26),transparent_60%)]">
                    <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_10%_70%,rgba(38,34,27,0.32),transparent_18%),radial-gradient(circle_at_26%_56%,rgba(38,34,27,0.28),transparent_20%),radial-gradient(circle_at_48%_46%,rgba(38,34,27,0.36),transparent_22%),radial-gradient(circle_at_67%_58%,rgba(38,34,27,0.24),transparent_18%),radial-gradient(circle_at_86%_38%,rgba(38,34,27,0.26),transparent_20%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.06)_50%,rgba(255,255,255,0.18)_100%)]" />
                    <div className="absolute right-4 bottom-4 sm:right-6 sm:bottom-6 flex items-center gap-2 sm:gap-3">
                        {!isMe && (
                            <Link
                                to={`/whispers/new/${user.handle}`}
                                type="button"
                                className="cursor-pointer grid h-10 w-10 place-items-center rounded-[6px] border-2 border-ink bg-bg text-text-base shadow-[4px_4px_0_var(--ink)] transition-transform hover:-translate-y-0.5"
                            >
                                <Send size={15} />
                            </Link>
                        )}
                        <button
                            type="button"
                            className="cursor-pointer grid h-10 w-10 place-items-center rounded-[6px] border-2 border-ink bg-bg text-text-base shadow-[4px_4px_0_var(--ink)] transition-transform hover:-translate-y-0.5"
                        >
                            <ExternalLink size={15} />
                        </button>
                        <button
                            type="button"
                            disabled={isMe}
                            className="cursor-pointer disabled:opacity-50 text-white min-w-[112px] rounded-[6px] border-2 border-ink bg-ink px-5 py-2.5 text-sm font-bold tracking-wide text-ink shadow-[4px_4px_0_var(--ink)] transition-transform hover:-translate-y-0.5"
                        >
                            Follow
                        </button>
                    </div>

                    <div className="absolute -bottom-10 left-4 sm:left-6">
                        <div className="rounded-[6px] border-2 border-ink bg-bg p-2 shadow-[4px_4px_0_var(--ink)]">
                            <Avatar
                                handle={user.handle}
                                size="lg"
                                className="!w-[92px] !h-[92px] text-[26px]"
                            />
                        </div>
                    </div>
                </div>

                <div className="px-4 pb-4 pt-14 sm:px-6 sm:pb-6 sm:pt-16 lg:px-7">
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0 max-w-2xl">
                                <h1 className="text-3xl sm:text-[2.5rem] font-black tracking-tight text-text-base">
                                    {user.username}
                                </h1>

                                <p className="mt-1 text-[15px] font-medium text-subtle">
                                    @{user.handle}
                                </p>

                                <p className="mt-5 max-w-2xl text-[15px] leading-7 text-text-base">
                                    {user.bio ||
                                        "This profile does not have a bio yet. It usually means the owner prefers to let posts and conversations do the talking."}
                                </p>

                                <div className="mt-5 flex flex-wrap items-center gap-3">
                                    {socialLinks.map(({ icon: Icon, label }) => (
                                        <button
                                            key={label}
                                            type="button"
                                            className="grid h-11 w-11 place-items-center rounded-[6px] border-2 border-ink bg-bg text-text-base shadow-[4px_4px_0_var(--ink)] transition-transform hover:-translate-y-0.5"
                                            aria-label={label}
                                        >
                                            <Icon size={16} />
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-6 flex flex-wrap items-center gap-3 text-[13px] text-subtle">
                                    {user.isVerified && (
                                        <span className="inline-flex items-center gap-2 rounded-[6px] border border-ink-soft bg-bg px-3 py-2 font-semibold text-text-base">
                                            <BadgeCheck size={15} className="text-av-blue" />{" "}
                                            Verified account
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-[35rem]">
                                {profileMetrics.map((item) => (
                                    <div
                                        key={item.label}
                                        className="min-h-[86px] rounded-[6px] border-2 border-ink bg-bg px-4 py-3 shadow-[4px_4px_0_var(--ink)]"
                                    >
                                        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-subtle">
                                            {item.label}
                                        </p>
                                        <p className="mt-3 text-[22px] font-black tracking-tight text-text-base">
                                            {item.value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                            <article className="rounded-[6px] border-2 border-ink bg-bg px-4 py-5 sm:px-5 sm:py-6 shadow-[4px_4px_0_var(--ink)]">
                                <h2 className="text-[18px] font-black tracking-tight text-text-base">
                                    About
                                </h2>
                                <p className="mt-4 text-[15px] leading-7 text-text-base">
                                    {user.bio ||
                                        "A short profile summary would normally live here. Use this space for a more personal description of the account owner, current interests, or the kind of work they want to be discovered for."}
                                </p>

                                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                    {accountFacts.map(({ icon: Icon, label, value }) => (
                                        <div
                                            key={label}
                                            className="rounded-[6px] border border-ink-soft bg-surface px-4 py-3"
                                        >
                                            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-subtle">
                                                <Icon size={12} />
                                                {label}
                                            </div>
                                            <p className="mt-2 break-words text-[14px] font-semibold text-text-base">
                                                {value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </article>

                            <aside className="rounded-[6px] border-2 border-ink bg-bg px-4 py-5 sm:px-5 sm:py-6 shadow-[4px_4px_0_var(--ink)]">
                                <div className="flex items-center gap-2">
                                    <div className="grid h-10 w-10 place-items-center rounded-[6px] border-2 border-ink bg-surface shadow-[3px_3px_0_var(--ink)]">
                                        <UserRound size={16} />
                                    </div>
                                    <div>
                                        <h2 className="text-[18px] font-black tracking-tight text-text-base">
                                            Quick Notes
                                        </h2>
                                        <p className="text-sm text-subtle">
                                            Small pieces of identity and activity.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 space-y-3">
                                    <div className="rounded-[6px] border border-ink-soft bg-surface px-4 py-3">
                                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-subtle">
                                            Public profile
                                        </p>
                                        <p className="mt-1 text-[14px] font-semibold text-text-base">
                                            This page is meant to feel like a profile card rather
                                            than a dashboard.
                                        </p>
                                    </div>

                                    <div className="rounded-[6px] border border-ink-soft bg-surface px-4 py-3">
                                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-subtle">
                                            Contact path
                                        </p>
                                        <p className="mt-1 text-[14px] font-semibold text-text-base">
                                            Use the whisper action to continue the conversation.
                                        </p>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
