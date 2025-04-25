import { z } from 'zod';

export const updateInvoiceSchema = z.object({
  status: z.enum(['NEW', 'PENDING', 'PAID', 'CANCELED', 'OVERDUE']).optional(),
  comment: z.string().optional(),
  paymentDate: z.date().optional(),
});

export type UpdateInvoiceDto = z.infer<typeof updateInvoiceSchema>;
