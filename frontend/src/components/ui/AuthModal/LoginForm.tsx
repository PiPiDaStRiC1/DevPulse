import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks";

export const LoginForm = () => {
    const [showPass, setShowPass] = useState(false);
    const {
        submitForm,
        login: { registerLogin, loginErrors, isLoginValid, handleLoginSubmit },
    } = useAuth();

    return (
        <form
            onSubmit={handleLoginSubmit(submitForm)}
            className="flex max-w-full w-[40rem] flex-col gap-3"
        >
            <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-[11px] font-bold text-text-base">Email</label>
                <input
                    {...registerLogin("email")}
                    type="email"
                    placeholder="you@example.com"
                    className={[
                        "bg-bg border-2 border-ink rounded-[var(--radius)] px-3 py-2",
                        "text-sm text-text-base placeholder:text-subtle font-[inherit]",
                        "outline-none focus:outline-none transition-colors",
                    ].join(" ")}
                />
                {loginErrors.email && (
                    <p className="text-[11px] text-danger">{loginErrors.email.message}</p>
                )}
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-text-base">Password</label>
                <div className="flex items-center bg-bg border-2 border-ink rounded-[var(--radius)] px-3 py-2 gap-2">
                    <input
                        {...registerLogin("password")}
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
                {loginErrors.password && (
                    <p className="text-[11px] text-danger">{loginErrors.password.message}</p>
                )}
            </div>
            <button
                type="submit"
                disabled={!isLoginValid}
                className={`${!isLoginValid ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} btn-solid w-full justify-center py-2.5`}
            >
                Sign in
            </button>
        </form>
    );
};
