import { z } from 'zod';

export const startTimesheetSchema = z.object({
  username: z.string().optional(),
  project_id: z.number().optional(),
  activity_id: z.number().optional(),
  task_id: z.number().optional(),
  description: z.string().optional(),
});

export type StartTimesheetDto = z.infer<typeof startTimesheetSchema>;
