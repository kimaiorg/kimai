import { z } from 'zod';

export const updateExpenseSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  color: z.string().optional(),
  project_id: z.number().optional(),
  activity_id: z.number().optional(),
  category_id: z.number().optional(),
  cost: z.number().min(0).optional(),
});

export type UpdateExpenseDto = z.infer<typeof updateExpenseSchema>;
