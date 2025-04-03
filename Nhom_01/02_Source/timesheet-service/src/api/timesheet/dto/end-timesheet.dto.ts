import { z } from 'zod';

export const endTimesheetSchema = z.object({
  description: z.string().optional(),
  user_id: z.string(),
});

export type EndTimesheetDto = z.infer<typeof endTimesheetSchema>;
