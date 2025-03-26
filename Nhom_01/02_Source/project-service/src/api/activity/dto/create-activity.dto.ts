import { z } from 'zod';

export const createActivitySchema = z.object({
  name: z.string().nonempty(),
  color: z.string().optional(),
  description: z.string().optional(),
  activity_number: z.number().optional(),
  budget: z.number().optional(),
  project_id: z.number(),
  team_id: z.number(),
});

export type CreateActivityDto = z.infer<typeof createActivitySchema>;
