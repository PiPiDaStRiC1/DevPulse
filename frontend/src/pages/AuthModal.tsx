import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Logo } from "@/components/common";
import { useNavigate } from "react-router-dom";
import { Form } from "@/components/ui";

type Tab = "login" | "register";

const TABS: Tab[] = ["login", "register"];

export const AuthModal = () => {
    const navigate = useNavigate();
    const [tab, setTab] = useState<Tab>("login");
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") navigate(-1);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [navigate]);

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!modalRef.current) return;

            if (!modalRef.current.contains(event.target as Node)) {
                navigate(-1);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [navigate]);

    return (
        <div
            className="fixed inset-0 z-100 flex items-center justify-center px-4"
            style={{ background: "rgba(26,46,26,0.55)", backdropFilter: "blur(2px)" }}
        >
            <div
                ref={modalRef}
                className="relative w-full max-w-[420px] bg-surface border-2 border-ink rounded-[var(--radius)] flex flex-col gap-5 p-7"
                style={{ boxShadow: "6px 6px 0 var(--ink)" }}
            >
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 right-4 text-muted hover:text-text-base bg-transparent border-0 cursor-pointer transition-colors"
                    aria-label="Close"
                >
                    <X size={16} />
                </button>

                <Logo />

                <div className="flex gap-1.5">
                    {TABS.map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={[
                                "flex-1 text-sm font-bold py-2 border-2 border-ink rounded-[var(--radius)]",
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

                <div className="-mt-1">
                    <h2 className="text-lg font-bold tracking-tight text-text-base">
                        {tab === "login" ? "Welcome back" : "Join DevPulse"}
                    </h2>
                    <p className="text-[12px] text-muted mt-0.5">
                        {tab === "login"
                            ? "Sign in to your account to continue"
                            : "Create your account in seconds"}
                    </p>
                </div>

                <Form tab={tab} />

                <button className="btn-solid w-full justify-center py-2.5">
                    {tab === "login" ? "Sign in" : "Create account"}
                </button>

                <p className="text-[11px] text-center text-muted -mt-1">
                    {tab === "login" ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => setTab(tab === "login" ? "register" : "login")}
                        className="font-bold text-text-base underline underline-offset-2 bg-transparent border-0 cursor-pointer font-[inherit] text-[11px]"
                    >
                        {tab === "login" ? "Create one" : "Sign in"}
                    </button>
                </p>
            </div>
        </div>
    );
};
