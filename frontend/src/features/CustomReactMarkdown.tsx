import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeSlug from "rehype-slug";

interface CustomReactMarkdownProps {
    content: string;
}

export const CustomReactMarkdown = ({ content }: CustomReactMarkdownProps) => {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            rehypePlugins={[rehypeSlug]}
            components={{
                pre: ({ children }) => (
                    <pre className="max-w-full overflow-x-auto whitespace-pre rounded border-2 border-ink bg-[#f0ede3] px-4 py-3 shadow-[2px_2px_0_var(--ink)]">
                        {children}
                    </pre>
                ),
                code: ({ className, children, ...props }) => {
                    const isBlockCode = !!className;

                    return isBlockCode ? (
                        <code className="block whitespace-pre min-w-max" {...props}>
                            {children}
                        </code>
                    ) : (
                        <code {...props}>{children}</code>
                    );
                },
                h1: ({ children, ...props }) => (
                    <h1 {...props} className="scroll-mt-18">
                        {children}
                    </h1>
                ),

                h2: ({ children, ...props }) => (
                    <h2 {...props} className="scroll-mt-18">
                        {children}
                    </h2>
                ),

                h3: ({ children, ...props }) => (
                    <h3 {...props} className="scroll-mt-18">
                        {children}
                    </h3>
                ),

                h4: ({ children, ...props }) => (
                    <h4 {...props} className="scroll-mt-18">
                        {children}
                    </h4>
                ),

                h5: ({ children, ...props }) => (
                    <h5 {...props} className="scroll-mt-18">
                        {children}
                    </h5>
                ),

                h6: ({ children, ...props }) => (
                    <h6 {...props} className="scroll-mt-18">
                        {children}
                    </h6>
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    );
};
