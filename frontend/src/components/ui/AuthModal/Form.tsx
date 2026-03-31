import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface FormProps {
    tab: "login" | "register";
}

export const Form = ({ tab }: FormProps) => {
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <div className="flex max-w-full w-[40rem] flex-col gap-3">
            {tab === "register" && (
                <div className="w-full gap-5 flex">
                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                        <label className="text-[11px] font-bold text-text-base">Username</label>
                        <input
                            type="text"
                            placeholder="Your name"
                            className={[
                                "bg-bg border-2 border-ink rounded-[var(--radius)] px-3 py-2",
                                "text-sm text-text-base placeholder:text-subtle font-[inherit]",
                                "outline-none focus:outline-none transition-colors",
                            ].join(" ")}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                        <label className="text-[11px] font-bold text-text-base">Handle</label>
                        <input
                            type="text"
                            placeholder="@handle"
                            className={[
                                "bg-bg border-2 border-ink rounded-[var(--radius)] px-3 py-2",
                                "text-sm text-text-base placeholder:text-subtle font-[inherit]",
                                "outline-none focus:outline-none transition-colors",
                            ].join(" ")}
                        />
                    </div>
                </div>
            )}
            <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-[11px] font-bold text-text-base">Email</label>
                <input
                    type="email"
                    placeholder="you@example.com"
                    className={[
                        "bg-bg border-2 border-ink rounded-[var(--radius)] px-3 py-2",
                        "text-sm text-text-base placeholder:text-subtle font-[inherit]",
                        "outline-none focus:outline-none transition-colors",
                    ].join(" ")}
                />
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-text-base">Password</label>
                <div className="flex items-center bg-bg border-2 border-ink rounded-[var(--radius)] px-3 py-2 gap-2">
                    <input
                        type={showPass ? "text" : "password"}
                        placeholder="········"
                        className="flex-1 bg-transparent text-sm text-text-base placeholder:text-subtle font-[inherit] outline-none focus:outline-none border-0"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPass((v) => !v)}
                        className="text-muted hover:text-text-base bg-transparent border-0 cursor-pointer transition-colors shrink-0"
                        aria-label={showPass ? "Hide" : "Show"}
                    >
                        {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                </div>
            </div>
            {tab === "register" && (
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-text-base">Confirm password</label>
                    <div className="flex items-center bg-bg border-2 border-ink rounded-[var(--radius)] px-3 py-2 gap-2">
                        <input
                            type={showConfirm ? "text" : "password"}
                            placeholder="········"
                            className="flex-1 bg-transparent text-sm text-text-base placeholder:text-subtle font-[inherit] outline-none focus:outline-none border-0"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm((v) => !v)}
                            className="text-muted hover:text-text-base bg-transparent border-0 cursor-pointer transition-colors shrink-0"
                            aria-label={showConfirm ? "Hide" : "Show"}
                        >
                            {showConfirm ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
