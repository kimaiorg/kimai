import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().nonempty(),
  color: z.string().optional(),
  project_number: z.number(),
  order_number: z.number(),
  order_date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    })
    .transform((val) => new Date(val)),
  start_date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    })
    .transform((val) => new Date(val)),
  end_date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    })
    .transform((val) => new Date(val)),
  budget: z.number().optional(),

  teams: z.array(z.number()).optional(),
  customer: z.number(),
});

export type CreateProjectDto = z.infer<typeof createProjectSchema>;
