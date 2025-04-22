import { ActivityType } from "@/type_schema/activity";
import { CategoryType } from "@/type_schema/category";
import { ProjectType } from "@/type_schema/project";
import { TaskSimpleType } from "@/type_schema/task";
import { z } from "zod";

export type ExpenseSimpleType = {
  id: number;
  name: string;
  color: string;
  description: string;
  project_id: number;
  activity_id: number;
  category_id: number;
  cost: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type ExpenseType = {
  id: number;
  name: string;
  color: string;
  description: string;
  project: ProjectType;
  activity: ActivityType;
  category: CategoryType;
  quantity: number;
  cost: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  task: TaskSimpleType[];
};

export const CreateExpenseRequestSchema = z
  .object({
    name: z
      .string()
      .min(4, {
        message: "Name is too short"
      })
      .max(255, {
        message: "Name is too long"
      }),
    color: z.string(),
    description: z.string(),
    activity_id: z
      .string({
        required_error: "Activity is required"
      })
      .nonempty({
        message: "Activity is required"
      }),
    project_id: z
      .string({
        required_error: "Assignee is required"
      })
      .nonempty({
        message: "Assignee is required"
      }),
    category_id: z
      .string({
        required_error: "Assignee is required"
      })
      .nonempty({
        message: "Assignee is required"
      }),
    quantity: z.string({
      required_error: "Quantity is required"
    }),
    cost: z.string({
      required_error: "Cost is required"
    })
  })
  .strict();
// .refine(
//   (datetime) => {
//     const now = new Date().getTime();
//     const deadlineDate = new Date(data.deadline).getTime();
//     return now < deadlineDate;
//   },
//   {
//     message: "Deadline must be in the future",
//     path: ["deadline"]
//   }
// );

export type CreateExpenseValidation = z.infer<typeof CreateExpenseRequestSchema>;
export type UpdateExpenseValidation = z.infer<typeof CreateExpenseRequestSchema>;
export type CreateExpenseRequestDTO = {
  name: string;
  description: string;
  color: string;
  activity_id: number;
  project_id: number;
  category_id: number;
  quantity: number;
  cost: number;
};

export type UpdateExpenseRequestDTO = {
  name: string;
  description: string;
  color: string;
  activity_id: number;
  project_id: number;
  category_id: number;
  quantity: number;
  cost: number;
};
