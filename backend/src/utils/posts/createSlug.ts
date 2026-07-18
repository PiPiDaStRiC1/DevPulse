export function createSlug(name: string) {
    return name.toLowerCase().replace(/\s+/g, "-");
}
