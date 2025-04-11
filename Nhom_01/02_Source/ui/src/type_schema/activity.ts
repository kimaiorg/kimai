import { CustomerProjectType } from "@/type_schema/project";
import { TaskSimpleType } from "@/type_schema/task";
import { TeamSimpleType, TeamType } from "@/type_schema/team";
import { z } from "zod";

export type ActivitySimpleType = {
  id: number;
  name: string;
  color: string;
  description: string;
  activity_number: number;
  budget: number;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  project_id: number;
  team_id: number;
  quota?: number;
};

export type ActivityType = {
  id: number;
  name: string;
  color: string;
  description: string;
  activity_number: number;
  budget: number;
  project_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  project: CustomerProjectType;
  team: TeamSimpleType;
  tasks: TaskSimpleType[];
  quota?: number;
};

export const activityFilters = [
  {
    name: "activity_number",
    label: "Activity Number",
    type: "text"
  },
  {
    name: "budget",
    label: "Budget",
    type: "number"
  },
  {
    name: "name",
    label: "Name",
    type: "text"
  },
  {
    name: "created_at",
    label: "Created At",
    type: "date"
  }
];

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
  }),
  quota: z.string().nonempty({
    message: "Project is required"
  })
});

export type CreateActivityValidation = z.infer<typeof CreateActivityRequestSchema>;
export type UpdateActivityValidation = z.infer<typeof CreateActivityRequestSchema>;
export type CreateActivityRequestDTO = {
  name: string;
  color: string;
  description?: string;
  project_id: number;
  team_id: number;
  budget: number;
  activity_number: number;
  quota: number;
};

export type UpdateActivityRequestDTO = {
  name: string;
  color: string;
  description?: string;
  project_id: number;
  team_id: number;
  budget: number;
  activity_number: number;
  quota: number;
};
