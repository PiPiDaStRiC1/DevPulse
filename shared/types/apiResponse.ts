interface ApiResponseSuccess<T> {
    success: true;
    data: T;
}

interface ApiResponseError {
    success: false;
    data: string;
}

export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError;
