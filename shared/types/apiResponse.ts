import type { User } from "./index";

interface ApiResponseSuccess<T> {
    success: true;
    data: T;
}

interface ApiResponseError {
    success: false;
    error: string;
}

export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError;
export type AuthResponse = ApiResponse<{ token: string; user: User }>;
