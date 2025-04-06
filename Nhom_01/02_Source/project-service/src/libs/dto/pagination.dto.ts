import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  sort_by: z.enum(['created_at']).optional().default('created_at'),
  sort_order: z.enum(['asc', 'desc']).optional().default('desc'),
  keyword: z.string().optional(),
});

export type PaginationDto = z.infer<typeof paginationSchema>;
