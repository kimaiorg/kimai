import { z } from "zod";

export interface ActivityType {
  activity_number: number;
  budget: number;
  color: string;
  created_at: string;
  deleted_at: null | string;
  description: string;
  id: number;
  name: string;
  project_id: number;
  team_id: number;
  updated_at: string;
}

export const CreateActivityRequestSchema = z.object({
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
  project_id: z
    .string({
      required_error: "Project is required"
    })
    .nonempty({
      message: "Project is required"
    }),
  team_id: z.string().nonempty({
    message: "Project is required"
  }),
  budget: z.string().min(1, {
    message: "Budget is required"
  }),
  activity_number: z.string().min(2, {
    message: "Company name is too short"
  })
});

export type CreateActivityValidation = z.infer<typeof CreateActivityRequestSchema>;
export type CreateActivityRequestDTO = {
  name: string;
  color: string;
  description?: string;
  project_id: number;
  team_id: number;
  budget: number;
  activity_number: number;
};
