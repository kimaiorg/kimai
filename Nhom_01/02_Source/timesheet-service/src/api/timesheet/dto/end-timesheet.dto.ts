import { z } from 'zod';

export const endTimesheetSchema = z.object({
  description: z.string().optional(),
});

export type EndTimesheetDto = z.infer<typeof endTimesheetSchema>;
