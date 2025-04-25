import { z } from 'zod';

export const updateInvoiceStatusSchema = z.object({
  description: z.string().optional(),
  status: z.string().nonempty({
    message: 'Please select a status',
  }),
  paymentDate: z.string(),
});

export type UpdateInvoiceStatusDto = z.infer<typeof updateInvoiceStatusSchema>;
