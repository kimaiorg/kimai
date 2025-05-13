import { RequestType } from '@prisma/client';
import { z } from 'zod';

export const createRequestSchema = z
  .object({
    comment: z.string(),
    type: z.nativeEnum(RequestType),
    target_id: z.number(),
    request_data: z.record(z.string(), z.any()).optional(),
  })
  .refine((data) => {
    if (data.type === RequestType.CHANGE_EXPENSE_QUANTITY) {
      return (
        data.request_data?.quantity !== undefined &&
        data.request_data?.quantity > 0
      );
    }
    return true;
  });

export type CreateRequestDto = z.infer<typeof createRequestSchema>;
