import { ActivityIcon } from "lucide-react";

interface PreloaderProps {
    text?: string;
}

export const Preloader = ({ text = "Loading" }: PreloaderProps) => {
    return (
        <div className="flex items-center justify-center py-12" aria-live="polite" aria-busy="true">
            <div className="card flex flex-col items-center gap-2 px-5 py-4">
                <div className="relative flex h-15 w-15 items-center justify-center rounded-full border-2 border-ink bg-bg shadow-[3px_3px_0_var(--ink)]">
                    <span className="absolute inset-0 rounded-full border-[3px] border-ink-soft border-t-ink animate-[spin_1s_linear_infinite]" />
                    <ActivityIcon size={16} className="relative text-ink" />
                </div>
                <p className="mt-1 text-sm font-semibold text-text-base">{text}...</p>
            </div>
        </div>
    );
};
