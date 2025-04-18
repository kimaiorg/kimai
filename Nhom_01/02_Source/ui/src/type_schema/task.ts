import { ActivityType } from "@/type_schema/activity";
import { UserType } from "@/type_schema/user.schema";
import { z } from "zod";

export type TaskSimpleType = {
  id: number;
  title: string;
  deadline: string;
  activity_id: number;
  created_at: string;
  deleted_at: null | string;
  description: string;
  updated_at: string;
  user_id: string;
  status: string;
  billable: boolean;
};

export type TaskResponseType = {
  id: number;
  title: string;
  deadline: string;
  created_at: string;
  deleted_at: null | string;
  description: string;
  updated_at: string;
  activity: ActivityType;
  user_id: string;
  status: string;
  billable: boolean;
};

export type TaskType = {
  id: number;
  title: string;
  deadline: string;
  created_at: string;
  deleted_at: null | string;
  description: string;
  updated_at: string;
  activity: ActivityType;
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
      })
  })
  .strict()
  .refine(
    (data) => {
      const now = new Date().getTime();
      const deadlineDate = new Date(data.deadline).getTime();
      return now < deadlineDate;
    },
    {
      message: "Deadline must be in the future",
      path: ["deadline"]
    }
  );

export type CreateTaskValidation = z.infer<typeof CreateTaskRequestSchema>;
export type UpdateTaskValidation = z.infer<typeof CreateTaskRequestSchema>;
export type CreateTaskRequestDTO = {
  title: string;
  deadline: string;
  description?: string;
  activity_id: number;
  user_id: string;
};

export type UpdateTaskRequestDTO = {
  title: string;
  deadline: string;
  description?: string;
  activity_id: number;
  user_id: string;
};
