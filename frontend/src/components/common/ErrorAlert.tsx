import { AlertTriangle, RefreshCcw } from "lucide-react";

interface ErrorAlertProps {
    message: string;
    onRetry?: () => void;
}

export const ErrorAlert = ({ message, onRetry }: ErrorAlertProps) => {
    return (
        <div
            className="w-full h-full flex items-center justify-center min-h-[320px] p-4 sm:p-6"
            role="alert"
            aria-live="assertive"
        >
            <div className="max-w-sm w-full flex flex-col items-center gap-5 text-center">
                <div className="relative">
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-danger/20 scale-125" />
                    <div className="relative grid h-20 w-20 place-items-center rounded-full border-2 border-danger bg-gradient-to-br from-[#fff1ef] to-[#ffebe5] shadow-[6px_6px_0_#d7a6a1]">
                        <AlertTriangle size={32} className="text-danger" />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-black tracking-tight text-text-base">
                        Something went wrong
                    </h3>
                    <p className="text-sm leading-relaxed text-muted max-w-xs mx-auto">{message}</p>
                </div>

                <div className="pt-2 flex flex-col gap-3 w-full">
                    {onRetry && (
                        <button
                            type="button"
                            onClick={onRetry}
                            className="btn-solid flex-1 justify-center gap-2"
                        >
                            <RefreshCcw size={16} />
                            Try again
                        </button>
                    )}
                    <p className="text-[11px] text-subtle self-center sm:self-auto">
                        If the issue persists, try refreshing the page.
                    </p>
                </div>
            </div>
        </div>
    );
};
