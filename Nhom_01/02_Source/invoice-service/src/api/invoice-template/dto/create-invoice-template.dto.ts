import { z } from 'zod';

export const createInvoiceTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  content: z.string().min(1, 'Content is required'),
  isActive: z.boolean().optional().default(true),
  variables: z.array(z.string()).optional(),
  description: z.string().optional(),
});

export type CreateInvoiceTemplateDto = z.infer<
  typeof createInvoiceTemplateSchema
>;
