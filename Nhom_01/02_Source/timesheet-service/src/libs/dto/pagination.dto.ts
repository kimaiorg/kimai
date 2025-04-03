import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.number().optional().default(1),
  limit: z.number().optional().default(10),
  sortBy: z.enum(['created_at']).optional().default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type PaginationDto = z.infer<typeof paginationSchema>;
