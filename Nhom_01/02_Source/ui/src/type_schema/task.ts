import { ActivityType } from "@/type_schema/activity";
import { ExpenseType } from "@/type_schema/expense";
import { UserType } from "@/type_schema/user.schema";
import { string, z } from "zod";

export type TaskSimpleType = {
  id: number;
  title: string;
  color: string;
  deadline: string;
  activity_id: number;
  created_at: string;
  deleted_at: null | string;
  description: string;
  updated_at: string;
  user_id: string;
  status: string; // PROCESSING, DONE. => DONE
  billable: boolean; // true, false. => true
  is_paid: boolean; // true, false. => false
  expense_id: number; // => query expense => cost
};

export type TaskResponseType = {
  id: number;
  title: string;
  color: string;
  deadline: string;
  created_at: string;
  deleted_at: null | string;
  description: string;
  updated_at: string;
  activity: ActivityType;
  expense: ExpenseType;
  expense_id: string;
  user_id: string;
  status: string;
  billable: boolean;
};

export type TaskType = {
  id: number;
  title: string;
  color: string;
  deadline: string;
  created_at: string;
  deleted_at: null | string;
  description: string;
  updated_at: string;
  activity: ActivityType;
  expense: ExpenseType;
  user: UserType;
  status: string;
  billable: boolean;
};

export const CreateTaskRequestSchema = z
  .object({
    title: z
      .string({
        required_error: "Title is required"
      })
      .trim()
      .min(5, {
        message: "Title must be at least 2 characters long"
      })
      .max(70, {
        message: "Title must not exceed 70 characters"
      }),
    color: string(),
    deadline: z.string(),
    // timeEstimate: z.string(),
    description: z.string().optional(),
    activity_id: z
      .string({
        required_error: "Activity is required"
      })
      .nonempty({
        message: "Activity is required"
      }),
    user_id: z
      .string({
        required_error: "Assignee is required"
      })
      .nonempty({
        message: "Assignee is required"
      }),
    expense_id: z
      .string({
        required_error: "Expense is required"
      })
      .nonempty({
        message: "Expense is required"
      })
  })
  .strict();
// .refine(
//   (data) => {
//     const now = new Date().getTime();
//     const deadlineDate = new Date(data.deadline).getTime();
//     return now < deadlineDate;
//   },
//   {
//     message: "Deadline must be in the future",
//     path: ["deadline"]
//   }
// );

export type CreateTaskValidation = z.infer<typeof CreateTaskRequestSchema>;
export type UpdateTaskValidation = z.infer<typeof CreateTaskRequestSchema>;
export type CreateTaskRequestDTO = {
  title: string;
  color: string;
  deadline: string;
  description?: string;
  activity_id: number;
  user_id: string;
  expense_id: number;
};

export type UpdateTaskRequestDTO = {
  title: string;
  color: string;
  deadline: string;
  description?: string;
  activity_id: number;
  user_id: string;
  expense_id: number;
};
