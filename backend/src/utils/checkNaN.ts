import QueryString from "qs";

export function checkNaN(
    limit: string | QueryString.ParsedQs | (string | QueryString.ParsedQs)[] | undefined,
    defaultValue: number = 5,
): number {
    const limitNumber = Number(limit);

    if (isNaN(limitNumber) || limitNumber <= 0) {
        return defaultValue;
    }

    return limitNumber;
}
