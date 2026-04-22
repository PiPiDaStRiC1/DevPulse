import { AlertTriangle, RefreshCcw } from "lucide-react";

interface ErrorAlertProps {
    message: string;
    onRetry?: () => void;
}

export const ErrorAlert = ({ message, onRetry }: ErrorAlertProps) => {
    return (
        <div
            className="card overflow-hidden border-[#d7a6a1] p-5 sm:p-6"
            role="alert"
            aria-live="assertive"
        >
            <div className="flex gap-4">
                <div className="flex flex-col items-center gap-2 pt-0.5">
                    <div className="sq-avatar h-12 w-12 border-[#d7a6a1] bg-[#fff1ef] text-danger shadow-[3px_3px_0_var(--ink)]">
                        <AlertTriangle size={16} />
                    </div>
                </div>

                <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-danger/90">
                        Error
                    </p>
                    <h2 className="mt-1 text-lg font-bold tracking-tight text-text-base sm:text-xl">
                        We hit a snag
                    </h2>
                    <p className="mt-2 max-w-2xl break-words text-[14px] leading-relaxed text-muted">
                        {message}
                    </p>
                </div>

                {onRetry && (
                    <button
                        type="button"
                        onClick={onRetry}
                        className="btn-outline whitespace-nowrap self-start sm:self-auto"
                    >
                        <RefreshCcw size={14} />
                        Try again
                    </button>
                )}
            </div>
        </div>
    );
};
