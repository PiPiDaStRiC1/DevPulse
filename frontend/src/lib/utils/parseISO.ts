export function parseISO(time: Date) {
    const parts = time.toISOString().split("T");
    const timestamp = parts[1]?.slice(0, 5);

    return timestamp;
}
