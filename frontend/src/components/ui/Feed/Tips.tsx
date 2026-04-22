const markdownHints = [
    { token: "#", label: "H1 heading" },
    { token: "**text**", label: "Bold text" },
    { token: "- item", label: "Bullet list" },
    { token: "```", label: "Code block" },
];

export const Tips = () => {
    return (
        <div className="border-b border-ink-soft bg-surface/85 px-3 py-2">
            <div className="flex flex-wrap gap-2">
                {markdownHints.map((hint) => (
                    <span
                        key={hint.token}
                        className="inline-flex items-center gap-1.5 rounded-[var(--radius)] border border-ink-soft bg-bg px-2 py-1"
                    >
                        <span className="font-mono text-[11px] font-bold text-text-base">
                            {hint.token}
                        </span>
                        <span className="text-[11px] text-muted">{hint.label}</span>
                    </span>
                ))}
            </div>
        </div>
    );
}