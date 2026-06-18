import { ArrowDown } from "lucide-react";
import { useState } from "react";

interface HeadingItemProps {
    heading: { level: number; text: string; children: HeadingItemProps["heading"][] };
}

const parseHeading = (heading: string) => {
    return `#${heading
        .toLowerCase()
        .trim()
        .replace(/[^\p{L}\p{N}\s-]/gu, "")
        .replace(/\s+/g, "-")}`;
};

export const HeadingItem = ({ heading }: HeadingItemProps) => {
    const [isNestingOpen, setIsNestingOpen] = useState(false);
    const marginLeft = (heading.level - 1) * 20;
    const hasChildren = heading.children.length > 0;

    const toggleNesting = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsNestingOpen((prev) => !prev);
    };

    return (
        <div>
            <div
                className="relative text-text-base flex-1 flex items-center gap-1 hover:text-text-base transition-colors"
                style={{ marginLeft: `${marginLeft}px` }}
            >
                {hasChildren && (
                    <button
                        className="absolute cursor-pointer flex items-center"
                        onClick={toggleNesting}
                    >
                        <ArrowDown
                            size={18}
                            className={`transform ${isNestingOpen ? "-rotate-90" : ""}`}
                        />
                    </button>
                )}
                <a className="ml-5" href={parseHeading(heading.text)}>
                    {heading.text}
                </a>
            </div>

            {isNestingOpen && (
                <ul>
                    {heading.children.map((child, index) => (
                        <HeadingItem key={index} heading={child} />
                    ))}
                </ul>
            )}
        </div>
    );
};
