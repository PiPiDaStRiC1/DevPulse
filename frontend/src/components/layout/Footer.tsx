import { Logo } from "@/components/common";
import { Github, Twitter, Rss, Zap, Code2, Globe } from "lucide-react";
import { navLinks } from "@/lib/constants";
import { Link } from "react-router-dom";

const social = [
    { Icon: Github, label: "GitHub" },
    { Icon: Twitter, label: "Twitter" },
    { Icon: Rss, label: "RSS" },
];

const techStack = ["React 19", "TypeScript", "Tailwind v4", "Vite", "Node.js"];

export const Footer = () => {
    return (
        <footer
            className="bg-surface border-t-2 border-ink"
            style={{ boxShadow: "-3px 0 0 0 var(--ink)" }}
        >
            <div className="max-w-7xl mx-auto pt-10 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
                    <div className="flex flex-col gap-5">
                        <Logo />
                        <p className="text-sm text-muted leading-relaxed max-w-[220px]">
                            A place for developers to share ideas, snippets, and builds. Built by
                            devs, for devs.
                        </p>
                        <div className="flex gap-3">
                            {social.map(({ Icon, label }) => (
                                <button
                                    key={label}
                                    aria-label={label}
                                    className="w-8 h-8 flex items-center justify-center border-2 border-ink-soft rounded-[var(--radius)] text-muted hover:text-text-base hover:border-ink transition-colors cursor-pointer bg-transparent"
                                >
                                    <Icon size={14} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-subtle mb-4">
                            Navigate
                        </h4>
                        <ul className="flex flex-col gap-2.5">
                            {navLinks.map(({ label, path }) => (
                                <li key={label}>
                                    <Link
                                        to={path}
                                        className="text-sm text-muted hover:text-text-base transition-colors font-medium flex items-center gap-1.5 group"
                                    >
                                        <span className="w-3 h-px bg-ink-soft group-hover:w-4 group-hover:bg-ink transition-all duration-150" />
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-subtle mb-4">
                            Built with
                        </h4>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {techStack.map((tech) => (
                                <span key={tech} className="tag-badge">
                                    {tech}
                                </span>
                            ))}
                        </div>
                        <div className="flex flex-col gap-2 text-xs text-muted">
                            <span className="flex items-center gap-1.5">
                                <Zap size={11} /> Real-time feed updates
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Code2 size={11} /> Syntax-highlighted snippets
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Globe size={11} /> Community-first platform
                            </span>
                        </div>
                    </div>
                </div>

                <div className="border-t-2 border-ink-soft pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-subtle font-medium">
                        © {new Date().getFullYear()} DevPulse
                    </p>
                    <p className="text-xs text-subtle font-mono">v0.1.0</p>
                </div>
            </div>
        </footer>
    );
};
