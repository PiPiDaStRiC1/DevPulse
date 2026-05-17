import type { User } from "./index";

interface ApiResponseSuccess<T> {
    success: true;
    data: T;
}

interface ApiResponseError {
    success: false;
    error: string;
}

interface AcknowledgementResponseCorrectWithData<T> {
    ok: true;
    data: T;
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
export type Acknowledgement<T = never> =
    | AcknowledgementResponseError
    | ([T] extends [never]
          ? AcknowledgementResponseCorrect
          : AcknowledgementResponseCorrectWithData<T>);
export type ChatOnlineAcknowledgement = Acknowledgement<{ isUserOnline: boolean }>;