export const genericFetch = async <T>(url: string, options?: RequestInit): Promise<T> => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json() as T;
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
};
