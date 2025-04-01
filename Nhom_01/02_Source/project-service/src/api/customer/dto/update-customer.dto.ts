import { z } from 'zod';

export const updateCustomerSchema = z.object({
  name: z.string().optional(),
  color: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  company_name: z.string().optional(),
  account_number: z.string().optional(),
  vat_id: z.string().optional(),
  country: z.string().optional(),
  currency: z.string().optional(),
  timezone: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  homepage: z.string().optional(),
});

export type UpdateCustomerDto = z.infer<typeof updateCustomerSchema>;
