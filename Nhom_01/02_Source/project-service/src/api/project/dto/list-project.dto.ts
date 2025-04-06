import { paginationSchema } from '@/libs/dto/pagination.dto';
import { z } from 'zod';

export const listProjectSchema = paginationSchema.extend({
  customer_id: z.number().optional(),
  budget_from: z.coerce.number().optional(),
  budget_to: z.coerce.number().optional(),
  sort_by: z
    .enum(['created_at', 'name', 'budget'])
    .optional()
    .default('created_at'),
});

export type ListProjectDto = z.infer<typeof listProjectSchema>;
