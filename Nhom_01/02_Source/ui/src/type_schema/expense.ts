import { ActivitySimpleType } from "@/type_schema/activity";
import { CustomerProjectType } from "@/type_schema/project";
import { UserType } from "@/type_schema/user.schema";
import { z } from "zod";

export type ExpenseType = {
  id: number;
  name: string;
  color: string;
  lead: UserType;
  users: UserType[];
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  projects: CustomerProjectType[];
  activities: ActivitySimpleType[];
};

export type ExpenseSimpleType = {
  id: number;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  lead: string;
  users: string[];
};

export const CreateExpenseRequestSchema = z.object({
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
  color: z.string()
});

export type CreateExpenseValidation = Omit<z.infer<typeof CreateExpenseRequestSchema>, "members">;
export type CreateExpenseRequestDTO = z.infer<typeof CreateExpenseRequestSchema> & {
  users: string[];
  lead: string;
};

export type UpdateExpenseRequestDTO = z.infer<typeof CreateExpenseRequestSchema> & {
  users: string[];
  lead: string;
};
