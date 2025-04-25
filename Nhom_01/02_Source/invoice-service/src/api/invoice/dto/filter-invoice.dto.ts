import { z } from 'zod';

export const filterInvoiceSchema = z.object({
  customer_id: z.coerce.number().positive({
    message: 'Please select a customer',
  }),
  from: z.string().nonempty({
    message: 'Please select a date start',
  }),
  to: z.string().nonempty({
    message: 'Please select a date end',
  }),
  project_id: z.coerce.number().positive({
    message: 'Please select a project',
  }),
  period: z.string().optional(),
  activities: z.array(z.coerce.number()).min(1, {
    message: 'At least one activity must be selected',
  }),
}).superRefine(({ from, to }, ctx) => {
  if (new Date(from) > new Date(to)) {
    ctx.addIssue({
      code: 'custom',
      message: 'End time must be after the start time',
      path: ['to'],
    });
  }
});

export type FilterInvoiceDto = z.infer<typeof filterInvoiceSchema>;
