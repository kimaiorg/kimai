import { z } from 'zod';

export const startTimesheetManuallySchema = z.object({
  username: z.string().optional(),
  project_id: z.number().optional(),
  activity_id: z.number().optional(),
  task_id: z.number().optional(),
  description: z.string().optional(),
  start_time: z.string(),
  end_time: z.string(),
});

export type StartTimesheetManuallyDto = z.infer<
  typeof startTimesheetManuallySchema
>;
