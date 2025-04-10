import { ActivitySimpleType, ActivityType } from "@/type_schema/activity";
import { CustomerProjectType } from "@/type_schema/project";
import { UserType } from "@/type_schema/user.schema";
import { z } from "zod";

export type TeamType = {
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

export type TeamSimpleType = {
  id: number;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  lead: string;
  users: string[];
};

export type TeamResponseType = Omit<TeamType, "users" | "lead"> & {
  lead: string;
  users: string[];
};

export const CreateTeamRequestSchema = z.object({
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

export type CreateTeamValidation = Omit<z.infer<typeof CreateTeamRequestSchema>, "members">;
export type CreateTeamRequestDTO = z.infer<typeof CreateTeamRequestSchema> & {
  users: string[];
  lead: string;
};

export type UpdateTeamRequestDTO = z.infer<typeof CreateTeamRequestSchema> & {
  users: string[];
  lead: string;
};
