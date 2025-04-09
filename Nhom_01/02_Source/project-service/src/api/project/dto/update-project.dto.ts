import { z } from 'zod';

export const updateProjectSchema = z.object({
  name: z.string().optional(),
  color: z.string().optional(),
  project_number: z.number().optional(),
  order_number: z.number().optional(),
  order_date: z
    .string()
    .optional()
    .refine((val) => val === undefined || !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    })
    .transform((val) => (val ? new Date(val) : undefined)),
  start_date: z
    .string()
    .optional()
    .refine((val) => val === undefined || !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    })
    .transform((val) => (val ? new Date(val) : undefined)),
  end_date: z
    .string()
    .optional()
    .refine((val) => val === undefined || !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    })
    .transform((val) => (val ? new Date(val) : undefined)),
  budget: z.number().optional(),
  teams: z
    .array(z.number())
    .optional()
    .transform((val) => {
      if (val === undefined) return {};
      return { set: val.map((id) => ({ id })) };
    }),
  customer_id: z.number().optional(),
});

export type UpdateProjectDto = z.infer<typeof updateProjectSchema>;
