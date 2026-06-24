export function countReadTime(content: string) {
    const wordsCount = content.trim() ? content.trim().split(/\s+/).length : 0;
    const WORDS_PER_MINUTE = 150;

    return Math.max(1, Math.ceil(wordsCount / WORDS_PER_MINUTE));
}
