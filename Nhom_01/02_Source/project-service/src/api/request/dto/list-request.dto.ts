import { paginationSchema } from '@/libs/dto/pagination.dto';
import { z } from 'zod';
import { RequestStatus, RequestType } from '@prisma/client';

export const listRequestSchema = paginationSchema.extend({
  user_id: z.string().optional(),
  team_id: z.coerce.number().optional(),
  sort_by: z
    .enum(['created_at', 'updated_at'])
    .optional()
    .default('created_at'),
  sort_order: z.enum(['asc', 'desc']).optional().default('desc'),
  status: z.nativeEnum(RequestStatus).optional(),
  type: z.nativeEnum(RequestType).optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
});

export type ListRequestDto = z.infer<typeof listRequestSchema>;
