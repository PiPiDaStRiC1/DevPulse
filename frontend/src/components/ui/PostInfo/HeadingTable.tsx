import { HeadingItem } from "@/components";
import { useMemo } from "react";

interface HeadingTableProps {
    content: string;
}

interface HeadingNode {
    level: number;
    text: string;
    children: HeadingNode[];
}

const buildNestedHeadings = (content: string) => {
    const headings = content
        .split("\n")
        .filter((line) => line.startsWith("#"))
        .map((line) => {
            const level = line.match(/^#+/)![0].length;
            const text = line.replace(/^#+\s*/, "").trim();
            return { level, text, children: [] };
        });

    const headingTree: HeadingNode[] = [];
    const parents: HeadingNode[] = [];

    headings.forEach((heading) => {
        while (parents.length > 0 && parents[parents.length - 1]!.level >= heading.level) {
            parents.pop();
        }

        if (parents.length > 0) {
            parents[parents.length - 1]!.children.push(heading);
        } else {
            headingTree.push(heading);
        }
        parents.push(heading);
    });

    return headingTree;
};

export const HeadingTable = ({ content }: HeadingTableProps) => {
    const headingTree = useMemo(() => buildNestedHeadings(content), [content]);

    console.log(headingTree);

    return (
        <aside className="hidden lg:block w-70">
            <div className="sticky top-20">
                <div className="max-h-[80vh] overflow-y-auto">
                    <div className="mb-4 text-lg text-text-base">Table of Contents</div>
                    <nav className="flex flex-col justify-center space-y-1">
                        {headingTree.length > 0 ? (
                            headingTree.map((heading, index) => (
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
