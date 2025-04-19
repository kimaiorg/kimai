import { paginationSchema } from '@/libs/dto/pagination.dto';
import { z } from 'zod';

export const listCategorySchema = paginationSchema.extend({});

export type ListCategoryDto = z.infer<typeof listCategorySchema>;
