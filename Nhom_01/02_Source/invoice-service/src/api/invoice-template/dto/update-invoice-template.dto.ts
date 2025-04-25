import { z } from 'zod';

export const updateInvoiceTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  isActive: z.boolean().optional(),
  variables: z.array(z.string()).optional(),
  description: z.string().optional(),
});

export type UpdateInvoiceTemplateDto = z.infer<typeof updateInvoiceTemplateSchema>;
