export const genericFetch = async <T>(url: string, options?: RequestInit): Promise<T> => {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            let errorMessage = response.statusText || "Request failed";

            try {
                const errorBody = (await response.json()) as { error?: string; message?: string };
                errorMessage = errorBody.error || errorBody.message || errorMessage;
            } catch {
                // Ignore body parse errors and keep status text fallback
            }

            throw new Error(errorMessage);
        }

        return response.json() as T;
    } catch (error) {
        console.error("Fetch error:", error);

        if (error instanceof Error) {
            throw error;
        }

        throw new Error("Unexpected request error");
    }
};
