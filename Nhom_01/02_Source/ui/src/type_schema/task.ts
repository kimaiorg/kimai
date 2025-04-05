import { z } from "zod";

export interface TaskType {
  activity_id: number;
  created_at: string;
  deadline: string;
  deleted_at: null | string;
  description: string;
  id: number;
  title: string;
  updated_at: string;
  user_id: string;
}

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
    from: z.string(),
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
      const fromDate = new Date(data.from).getTime();
      const deadlineDate = new Date(data.deadline).getTime();
      return fromDate < deadlineDate;
    },
    {
      message: "Deadline must be after the start date",
      path: ["deadline"]
    }
  );

export type CreateTaskValidation = z.infer<typeof CreateTaskRequestSchema>;
export type CreateTaskRequestDTO = {
  title: string;
  from: string;
  deadline: string;
  description?: string;
  activity_id: number;
  user_id: string;
};
