import { z } from 'zod';

export const updateTaskSchema = z.object({
  title: z.string().optional(),
  deadline: z
    .string()
    .optional()
    .refine((val) => val === undefined || !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    })
    .transform((val) => (val ? new Date(val) : undefined)),
  activity_id: z.number().optional(),
  user_id: z.string().optional(),
  expense_id: z.number().optional(),
});

export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
