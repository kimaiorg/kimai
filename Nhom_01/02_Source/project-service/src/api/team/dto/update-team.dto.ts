import { z } from 'zod';

export const updateTeamSchema = z.object({
  name: z.string().optional(),
  color: z.string().optional(),
  lead: z.string().optional(),
  users: z.array(z.string()).optional(),
});

export type UpdateTeamDto = z.infer<typeof updateTeamSchema>;
