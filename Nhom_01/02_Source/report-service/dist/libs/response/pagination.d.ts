export interface PaginationMetadata {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface PaginationResponse<T> {
    metadata: PaginationMetadata;
    data: T[];
}
