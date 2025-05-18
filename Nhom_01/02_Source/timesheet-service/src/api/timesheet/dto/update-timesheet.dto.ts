import { z } from 'zod';
import { RequestTimesheetStatus } from '@prisma/client';
export const updateTimesheetSchema = z.object({
  request_status: z.nativeEnum(RequestTimesheetStatus),
});

export type UpdateTimesheetDto = z.infer<typeof updateTimesheetSchema>;
