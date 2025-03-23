import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().nonempty(),
  color: z.string().optional(),
  description: z.string().optional(),
  address: z.string().nonempty(),
  company_name: z.string().nonempty(),
  account_number: z.string().nonempty(),
  vat_id: z.string().nonempty(),
  country: z.string().nonempty(),
  currency: z.string().optional(),
  timezone: z.string().optional(),
  email: z.string().email(),
  phone: z.string().nonempty(),
  homepage: z.string().optional(),
});

export type CreateProjectDto = z.infer<typeof createProjectSchema>;
