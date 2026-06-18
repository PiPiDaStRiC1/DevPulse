const MAX_PREVIEW_LENGTH = 200;

export function generateExcerpt(content: string, maxLength: number = MAX_PREVIEW_LENGTH) {
    const text = content.slice(0, maxLength).trimEnd();

    if (content.length <= maxLength) {
        return text;
    } else {
        return text + "...";
    }
}
