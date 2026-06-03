import { HeadingItem } from "@/components";
import { useMemo } from "react";

interface HeadingTableProps {
    content: string;
}

export const HeadingTable = ({ content }: HeadingTableProps) => {
    const headings = useMemo(
        () =>
            content
                .split("\n")
                .filter((line) => line.startsWith("#"))
                .map((line) => {
                    const level = line.match(/^#+/)![0].length;
                    const text = line.replace(/^#+\s*/, "").trim();
                    return { level, text };
                }),
        [content],
    );

    return (
        <aside className="hidden lg:block w-70">
            <div className="sticky top-20">
                <div className="max-h-[60vh] overflow-y-auto">
                    <div className="mb-4 text-lg text-text-base">Table of Contents</div>
                    <nav className="flex flex-col justify-center">
                        {headings.length > 0 ? (
                            headings.map((heading, index) => (
                                <HeadingItem key={index} heading={heading} />
                            ))
                        ) : (
                            <div className="text-subtle">No headings</div>
                        )}
                    </nav>
                </div>
            </div>
        </aside>
    );
};
