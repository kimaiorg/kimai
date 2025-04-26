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
  quantity: z.number().optional(),
  status: z.string().optional(),
  billable: z.boolean().optional(),
  is_paid: z.boolean().optional(),
  color: z.string().optional(),
});

export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
