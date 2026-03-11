interface ApiResponseCorrect<T> {
    success: true;
    data: T;
}

interface ApiResponseError {
    success: false;
    error: string;
}

export type ApiResponse<T> = ApiResponseCorrect<T> | ApiResponseError;
