import { title } from 'process';
import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1).max(255),
  deadline: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    })
    .transform((val) => new Date(val)),
  description: z.string().min(1).max(255),
  activity_id: z.number(),
  user_id: z.string(),
  expense_id: z.number(),
  quantity: z.number().optional(),
  color: z.string().optional(),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
