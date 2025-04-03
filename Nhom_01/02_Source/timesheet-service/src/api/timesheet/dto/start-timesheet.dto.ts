import { z } from 'zod';

export const startTimesheetSchema = z.object({
  description: z.string().optional(),
  user_id: z.string(),
});

export type StartTimesheetDto = z.infer<typeof startTimesheetSchema>;
