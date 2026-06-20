export const fmt = (n: number | string | undefined): string => {
    if (typeof n === "string") {
        n = isNaN(Number(n)) ? 0 : Number(n);
    }
    return n && n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
};
