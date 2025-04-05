import { UserType } from "@/type_schema/user.schema";
import { z } from "zod";

export type UserTeamType = UserType & {
  isTeamLead: boolean;
  color?: string;
};

export interface TeamType {
  id: number;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
  users: UserTeamType[];
}

export interface TeamSimpleType {
  id: number;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
  users: string[];
}

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
  members: string[];
};
