import { z } from 'zod';

export const startTimesheetSchema = z.object({
  username: z.string().optional(),
  project_id: z.string().optional(),
  activity_id: z.string().optional(),
  task_id: z.string().optional(),
  description: z.string().optional(),
});

export type StartTimesheetDto = z.infer<typeof startTimesheetSchema>;
