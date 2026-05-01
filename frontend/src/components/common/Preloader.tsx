import { ActivityIcon } from "lucide-react";

interface PreloaderProps {
    text?: string;
}

export const Preloader = ({ text = "Loading" }: PreloaderProps) => {
    return (
        <div
            className="w-full h-full flex items-center justify-center min-h-[320px] p-4 sm:p-6"
            role="status"
            aria-label={`${text}...`}
        >
            <div className="max-w-sm w-full flex flex-col items-center gap-6">
                <div className="relative flex h-20 w-20 items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-ink-soft border-dashed" />
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-ink bg-gradient-to-br from-bg to-surface shadow-[6px_6px_0_var(--ink)]">
                        <span className="absolute inset-1 rounded-full border-[3px] border-transparent border-t-ink border-r-ink/50 animate-[spin_2s_linear_infinite]" />
                        <ActivityIcon size={20} className="relative text-ink animate-pulse" />
                    </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <p className="text-lg font-bold tracking-tight text-text-base">{text}...</p>
                    <p className="text-xs text-subtle">Just a moment...</p>
                </div>
            </div>
        </div>
    );
};
