import { z } from 'zod';

export const createExpenseSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  color: z.string().optional(),
  project_id: z.number().optional(),
  activity_id: z.number(),
  category_id: z.number(),
  cost: z.number().min(0),
});

export type CreateExpenseDto = z.infer<typeof createExpenseSchema>;
