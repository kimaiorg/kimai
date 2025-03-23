import { z } from 'zod';

export const createTeamSchema = z.object({
  name: z.string().nonempty(),
  color: z.string().optional(),
  users: z.array(z.string()).optional(),
});

export type CreateTeamDto = z.infer<typeof createTeamSchema>;
