import { paginationSchema } from '@/libs/dto/pagination.dto';
import { z } from 'zod';

export const listCustomerSchema = paginationSchema.extend({
  sort_by: z.enum(['created_at', 'name']).optional().default('created_at'),
});

export type ListCustomerDto = z.infer<typeof listCustomerSchema>;
