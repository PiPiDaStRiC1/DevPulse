import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, Home } from "lucide-react";

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo?: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        this.setState({ hasError: true, error, errorInfo });
    }

    override render(): ReactNode {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen w-full bg-bg flex flex-col items-center justify-center p-4">
                    <div
                        className="bg-surface border-2 border-ink rounded-[var(--radius)] w-full max-w-sm flex flex-col items-center p-8 text-center"
                        style={{ boxShadow: "var(--shadow-card)" }}
                    >
                        <div className="w-16 h-16 bg-bg border-2 border-ink rounded-full flex items-center justify-center mb-4">
                            <AlertTriangle size={28} className="text-red-500" />
                        </div>

                        <h2 className="text-xl font-bold tracking-tight text-text-base mb-2">
                            Oops! System Glitch
                        </h2>

                        <p className="text-sm text-subtle mb-6">
                            Something unexpected went wrong. Please try returning to the home page
                            or refreshing.
                        </p>

                        {this.state.error && (
                            <div className="w-full bg-bg border-2 border-ink-soft rounded px-3 py-2 mb-6 max-h-28 overflow-y-auto text-left">
                                <code className="text-xs text-muted font-mono break-words">
                                    {this.state.error.message}
                                </code>
                            </div>
                        )}

                        <a
                            href="/"
                            className="btn-solid w-full flex items-center justify-center gap-2 py-2.5 h-auto font-bold"
                        >
                            <Home size={16} />
                            <span>Return to Home</span>
                        </a>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}
