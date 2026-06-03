import { ArrowDown } from "lucide-react";

interface HeadingItemProps {
    heading: { level: number; text: string };
}

const parseHeading = (heading: string) => {
    return `#${heading
        .toLowerCase()
        .toLowerCase()
        .trim()
        .replace(/[^\p{L}\p{N}\s-]/gu, "")
        .replace(/\s+/g, "-")}`;
};

export const HeadingItem = ({ heading }: HeadingItemProps) => {
    const marginLeft = (heading.level - 1) * 30;

    return (
        <>
            <a
                href={parseHeading(heading.text)}
                className="text-subtle"
                style={{ marginLeft: `${marginLeft}px` }}
            >
                <span className="flex items-center gap-1">
                    {marginLeft === 0 && <ArrowDown size={16} />}
                    {heading.text}
                </span>
            </a>
        </>
    );
};
