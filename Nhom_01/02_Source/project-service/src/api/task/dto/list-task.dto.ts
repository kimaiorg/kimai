import { paginationSchema } from '@/libs/dto/pagination.dto';
import { z } from 'zod';

export const listTaskSchema = paginationSchema.extend({
  activity_id: z.number().optional(),
  user_id: z.string().optional(),
});

export type ListTaskDto = z.infer<typeof listTaskSchema>;
