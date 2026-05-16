import type { User } from "./index";

interface ApiResponseSuccess<T> {
    success: true;
    data: T;
}

interface ApiResponseError {
    success: false;
    error: string;
}

interface AcknowledgementResponseCorrect {
    ok: true;
}

interface AcknowledgementResponseError {
    ok: false;
    error: string;
}

export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError;
export type AuthResponse = ApiResponse<{ token: string; user: User }>;
export type MeResponse = ApiResponse<User>;
export type RefreshResponse = ApiResponse<string>;
export type Acknowledgement = AcknowledgementResponseCorrect | AcknowledgementResponseError;