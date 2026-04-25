import { useState } from "react";
import { Zap, Users, Hash } from "lucide-react";
import { LoginForm, RegisterForm, Logo } from "@/components";

type Tab = "login" | "register";

const TABS: Tab[] = ["login", "register"];

const perks = [
    { icon: Zap, text: "Real-time dev feed — posts, snippets, opinions" },
    { icon: Users, text: "Follow engineers, designers, and builders" },
    { icon: Hash, text: "Explore trending topics across every stack" },
];

export const Auth = () => {
    const [tab, setTab] = useState<Tab>("login");

    return (
        <div className="min-h-[calc(100vh-49px)] -my-9 bg-bg flex overflow-hidden">
            <div className="hidden lg:flex flex-col gap-20 bg-ink text-accent-fg p-12">
                <Logo theme="light" size="lg" />

                <div className="flex flex-col gap-6">
                    <h1 className="text-4xl font-bold leading-[1.15] tracking-tight">
                        Where developers
                        <br />
                        <span
                            className="inline-block mt-1 px-2 py-0.5 border-2 border-accent-fg"
                            style={{ boxShadow: "3px 3px 0 var(--accent-fg)" }}
                        >
                            ship &amp; share
                        </span>
                    </h1>
                    <p className="text-[15px] leading-relaxed" style={{ color: "#8fab89" }}>
                        A focused space for engineers to post updates, share snippets, and keep a
                        pulse on the community.
                    </p>

                    <ul className="flex flex-col gap-3 mt-2">
                        {perks.map(({ icon: Icon, text }) => (
                            <li key={text} className="flex items-start gap-3">
                                <div
                                    className="mt-0.5 w-6 h-6 shrink-0 border border-accent-fg rounded-[var(--radius)] flex items-center justify-center"
                                    style={{ background: "rgba(255,254,248,0.08)" }}
                                >
                                    <Icon size={12} />
                                </div>
                                <span
                                    className="text-[13px] leading-relaxed"
                                    style={{ color: "#c2d4c0" }}
                                >
                                    {text}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center px-12 py-12 overflow-y-auto">
                <div className="w-full w-[400px] mx-auto flex flex-col gap-8">
                    <div>
                        <h2 className="text-[42px] font-bold leading-[1.05] tracking-tight text-text-base">
                            {tab === "login" ? (
                                <>
                                    Welcome
                                    <br />
                                    back.
                                </>
                            ) : (
                                <>
                                    Let's get
                                    <br />
                                    you in.
                                </>
                            )}
                        </h2>
                        <p className="text-[13px] text-muted mt-2">
                            {tab === "login"
                                ? "Sign in to your account to continue"
                                : "Create your account in seconds"}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        {TABS.map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={[
                                    "flex-1 text-sm font-bold py-2.5 border-2 border-ink rounded-[var(--radius)]",
                                    "cursor-pointer font-[inherit] transition-all duration-100",
                                    tab === t
                                        ? "bg-ink text-accent-fg"
                                        : "bg-transparent text-muted hover:text-text-base",
                                ].join(" ")}
                            >
                                {t === "login" ? "Sign in" : "Create account"}
                            </button>
                        ))}
                    </div>

                    {tab === "login" ? <LoginForm /> : <RegisterForm />}

                    <p className="text-[11px] text-subtle">
                        By continuing you agree to the Terms of Service.
                    </p>
                </div>
            </div>
        </div>
    );
};
