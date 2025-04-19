import { z } from "zod";

export type CategoryType = {
  id: number;
  name: string;
  color: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export const CreateCategoryRequestSchema = z.object({
  name: z
    .string({
      required_error: "Name is required"
    })
    .trim()
    .min(4, {
      message: "Name must be at least 2 characters long"
    })
    .max(70, {
      message: "Name must not exceed 70 characters"
    }),
  color: z.string(),
  description: z.string()
});

export type CreateCategoryValidation = z.infer<typeof CreateCategoryRequestSchema>;
export type CreateCategoryRequestDTO = {
  name: string;
  color: string;
  description: string;
};
export type UpdateCategoryValidation = z.infer<typeof CreateCategoryRequestSchema>;
export type UpdateCategoryRequestDTO = {
  name: string;
  color: string;
  description: string;
};
