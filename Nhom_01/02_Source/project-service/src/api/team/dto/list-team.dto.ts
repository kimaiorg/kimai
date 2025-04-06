import { paginationSchema } from '@/libs/dto/pagination.dto';
import { z } from 'zod';

export const listTeamSchema = paginationSchema.extend({
  lead_id: z.coerce.string().optional(),
  project_id: z.coerce.number().optional(),
  sort_by: z.enum(['created_at', 'name']).optional().default('created_at'),
});

export type ListTeamDto = z.infer<typeof listTeamSchema>;
