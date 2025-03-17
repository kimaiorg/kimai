export type SuccessResponseType<T, V> = {
    statusCode: number;
    message: string;
    data: T;
    other: V;
};

export type ErrorResponseType = {
    statusCode: number;
    message: string;
    // timestamp: string;
    // path: string;
    errorCode: string;
};

export type PaginationType<T> = {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
    data: T[];
};

export type PaginationV2Type<T> = {
    page: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    sorted: boolean;
    data: T[];
};
