import { paginationSchema } from '@/libs/dto/pagination.dto';
import { z } from 'zod';

export const listCustomerSchema = paginationSchema.extend({});

export type ListCustomerDto = z.infer<typeof listCustomerSchema>;
