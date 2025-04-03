import { paginationSchema } from '@/libs/dto/pagination.dto';
import { z } from 'zod';

export const listProjectSchema = paginationSchema.extend({
  customer_id: z.number().optional(),
});

export type ListProjectDto = z.infer<typeof listProjectSchema>;
