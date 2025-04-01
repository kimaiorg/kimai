import { paginationSchema } from '@/libs/dto/pagination.dto';
import { z } from 'zod';

export const listActivitySchema = paginationSchema.extend({
  project_id: z.number().optional(),
  team_id: z.number().optional(),
});

export type ListActivityDto = z.infer<typeof listActivitySchema>;
