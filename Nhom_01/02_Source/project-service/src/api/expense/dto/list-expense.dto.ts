import { paginationSchema } from '@/libs/dto/pagination.dto';
import { z } from 'zod';

export const listExpenseSchema = paginationSchema.extend({
  project_id: z.number().optional(),
  activity_id: z.number().optional(),
  category_id: z.number().optional(),
  sort_by: z.enum(['created_at', 'cost']).default('created_at'),

});

export type ListExpenseDto = z.infer<typeof listExpenseSchema>;
