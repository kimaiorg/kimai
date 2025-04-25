import { z } from 'zod';

export const createInvoiceSchema = z.object({
  customerId: z.number(),
  userId: z.number(),
  total: z.number().positive(),
  tax: z.number().min(0),
  subtotal: z.number().positive(),
  currency: z.string().default('USD'),
  vat: z.number().min(0).default(0),
  comment: z.string().optional(),
  dueDays: z.number().positive().default(14),
  timesheetIds: z.array(z.number()).optional(),
  items: z
    .array(
      z.object({
        description: z.string(),
        amount: z.number().positive(),
        rate: z.number().positive(),
        total: z.number().positive(),
        timesheetId: z.number().optional(),
        projectId: z.number(),
        activityId: z.number().optional(),
        begin: z.date().or(z.string()),
        end: z.date().or(z.string()),
      }),
    )
    .optional(),
});

export type CreateInvoiceDto = z.infer<typeof createInvoiceSchema> & {
  invoiceNumber?: string;
  dueDate?: Date;
};
