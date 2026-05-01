import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks";

export const RegisterForm = () => {
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const {
        submitForm,
        register: {
            registerRegister,
            registerErrors,
            isRegisterValid,
            handleRegisterSubmit,
            setValueRegister,
            watchRegister,
        },
    } = useAuth();
    const handle = watchRegister("handle") ?? "@";

    const normalizeHandle = (value: string) => {
        const withoutExtraPrefix = value.replace(/^@+/, "");

        if (!withoutExtraPrefix) {
            return "@";
        }

        return `@${withoutExtraPrefix}`;
    };

    const handleHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const currentValue = normalizeHandle(e.target.value);

        setValueRegister("handle", currentValue, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
        });
    };

    return (
        <form
            onSubmit={handleRegisterSubmit(submitForm)}
            className="flex max-w-full w-[40rem] flex-col gap-3"
        >
            <div className="w-full gap-5 flex">
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    <label className="text-[11px] font-bold text-text-base">Username</label>
                    <input
                        {...registerRegister("username")}
                        type="text"
                        placeholder="Your name"
                        className={[
                            "bg-bg border-2 border-ink rounded-[var(--radius)] px-3 py-2",
                            "text-sm text-text-base placeholder:text-subtle font-[inherit]",
                            "outline-none focus:outline-none transition-colors",
                        ].join(" ")}
                    />
                    {registerErrors.username && (
                        <p className="text-[11px] text-danger">{registerErrors.username.message}</p>
                    )}
                </div>
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    <label className="text-[11px] font-bold text-text-base">Handle</label>
                    <input
                        type="text"
                        onChange={(e) => handleHandler(e)}
                        value={handle}
                        placeholder="@handle"
                        className={[
                            "bg-bg border-2 border-ink rounded-[var(--radius)] px-3 py-2",
                            "text-sm text-text-base placeholder:text-subtle font-[inherit]",
                            "outline-none focus:outline-none transition-colors",
                        ].join(" ")}
                    />
                    {registerErrors.handle && (
                        <p className="text-[11px] text-danger">{registerErrors.handle.message}</p>
                    )}
                </div>
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-[11px] font-bold text-text-base">Email</label>
                <input
                    {...registerRegister("email")}
                    type="email"
                    placeholder="you@example.com"
                    className={[
                        "bg-bg border-2 border-ink rounded-[var(--radius)] px-3 py-2",
                        "text-sm text-text-base placeholder:text-subtle font-[inherit]",
                        "outline-none focus:outline-none transition-colors",
                    ].join(" ")}
                />
                {registerErrors.email && (
                    <p className="text-[11px] text-danger">{registerErrors.email.message}</p>
                )}
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-text-base">Password</label>
                <div className="flex items-center bg-bg border-2 border-ink rounded-[var(--radius)] px-3 py-2 gap-2">
                    <input
                        {...registerRegister("password")}
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
                {registerErrors.password && (
                    <p className="text-[11px] text-danger">{registerErrors.password.message}</p>
                )}
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-text-base">Confirm password</label>
                <div className="flex items-center bg-bg border-2 border-ink rounded-[var(--radius)] px-3 py-2 gap-2">
                    <input
                        {...registerRegister("confirmPassword")}
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
                {registerErrors.confirmPassword && (
                    <p className="text-[11px] text-danger">
                        {registerErrors.confirmPassword.message}
                    </p>
                )}
            </div>
            <button
                type="submit"
                disabled={!isRegisterValid}
                className={`${!isRegisterValid ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} btn-solid w-full justify-center py-2.5`}
            >
                Create account
            </button>
        </form>
    );
};
