import { z } from "zod";

export interface CustomerType {
  id: number;
  name: string;
  color: string;
  description: string;
  address: string;
  company_name: string;
  account_number: string;
  vat_id: string;
  country: string;
  currency: string;
  timezone: string;
  email: string;
  phone: string;
  homepage: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
}

export const CreateCustomerRequestSchema = z.object({
  name: z
    .string({
      required_error: "Name is required"
    })
    .trim()
    .min(5, {
      message: "Name must be at least 2 characters long"
    })
    .max(70, {
      message: "Name must not exceed 70 characters"
    }),
  color: z.string(),
  description: z.string().optional(),
  address: z
    .string({
      required_error: "Address is required"
    })
    .trim()
    .min(10, {
      message: "Address is too short"
    })
    .max(70, {
      message: "Address must not exceed 70 characters"
    }),
  company_name: z.string().min(2, {
    message: "Company name is too short"
  }),
  account_number: z.string().trim().min(2, {
    message: "Account number is not valid"
  }),
  vat_id: z.string().min(2, {
    message: "Vat number is not valid"
  }),
  country: z
    .string({
      required_error: "Country is required"
    })
    .trim()
    .min(2, {
      message: "Country must be at least 2 characters long"
    })
    .max(70, {
      message: "Country must not exceed 70 characters"
    }),
  currency: z.string().nonempty(),
  timezone: z.string().nonempty(),
  email: z
    .string({
      required_error: "Email is required"
    })
    .email({
      message: "Invalid email address"
    }),
  phone: z
    .string({
      required_error: "Phone number is required"
    })
    .min(10, {
      message: "Phone number must be exactly 10 digits"
    })
    .max(10, {
      message: "Phone number must be exactly 10 digits"
    }),
  homepage: z.string().optional(),
  visible: z.boolean().default(false),
  createdAt: z.date().optional()
});

export type CreateCustomerRequestDTO = z.infer<typeof CreateCustomerRequestSchema>;
