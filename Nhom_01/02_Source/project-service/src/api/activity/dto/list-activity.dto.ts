import { paginationSchema } from '@/libs/dto/pagination.dto';
import { z } from 'zod';

export const listActivitySchema = paginationSchema.extend({
  project_id: z.number().optional(),
  team_id: z.number().optional(),
  sort_by: z
    .enum(['created_at', 'name', 'budget'])
    .optional()
    .default('created_at'),
  budget_from: z.coerce.number().optional(),
  budget_to: z.coerce.number().optional(),
});

export type ListActivityDto = z.infer<typeof listActivitySchema>;
