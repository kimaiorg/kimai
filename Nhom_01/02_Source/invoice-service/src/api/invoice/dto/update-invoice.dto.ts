import { z } from 'zod';

export const updateInvoiceSchema = z.object({
  status: z.enum(['NEW', 'PENDING', 'PAID', 'CANCELED', 'OVERDUE']).optional(),
  comment: z.string().optional(),
  paymentDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
}).refine(data => {
  // At least one field must be provided
  return data.status !== undefined || data.comment !== undefined || data.paymentDate !== undefined;
}, {
  message: "At least one field must be provided",
  path: ["status", "comment", "paymentDate"]
});

export type UpdateInvoiceDto = z.infer<typeof updateInvoiceSchema>;
