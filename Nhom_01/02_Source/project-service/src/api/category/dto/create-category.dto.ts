import { title } from 'process';
import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1).max(255),
  color: z.string().optional(),
  description: z.string().optional(),
});

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
