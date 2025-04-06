import { paginationSchema } from '@/libs/dto/pagination.dto';
import { z } from 'zod';

export const listTaskSchema = paginationSchema.extend({
  activity_id: z.number().optional(),
  user_id: z.string().optional(),
  sort_by: z.enum(['created_at', 'title']).optional().default('created_at'),
});

export type ListTaskDto = z.infer<typeof listTaskSchema>;
