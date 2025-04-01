import { z } from 'zod';

export const updateActivitySchema = z.object({
  name: z.string().optional(),
  color: z.string().optional(),
  description: z.string().optional(),
  activity_number: z.number().optional(),
  budget: z.number().optional(),
  project_id: z.number().optional(),
  team_id: z.number().optional(),
});

export type UpdateActivityDto = z.infer<typeof updateActivitySchema>;
