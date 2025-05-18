import { RequestStatus } from '@prisma/client';
import { z } from 'zod';

export const updateRequestSchema = z.object({
  status: z.nativeEnum(RequestStatus),
});

export type UpdateRequestDto = z.infer<typeof updateRequestSchema>;
