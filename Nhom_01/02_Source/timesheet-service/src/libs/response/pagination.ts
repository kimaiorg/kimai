interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationResponse<T> {
  data: T[];
  metadata: Pagination;
}

export function createPaginationResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
): PaginationResponse<T> {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    metadata: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}
