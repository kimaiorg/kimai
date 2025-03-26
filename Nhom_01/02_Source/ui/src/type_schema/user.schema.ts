import z from "zod";

export type UserType = {
  created_at: string;
  user_id: string;
  email: string;
  picture: string;
  name: string;
  nickname: string;
  email_verified: boolean;
  updated_at: string;
};

export const CreateUserRequestSchema = z
  .object({
    name: z
      .string({
        required_error: "Invalid full name"
      })
      .trim()
      .min(2, {
        message: "Full name is invalid"
      })
      .max(70, {
        message: "Full name must not exceed 70 characters"
      })
      .regex(/\w+\s\w+/, { message: "Full name must be at least first name and last name" }),
    email: z.string().email(),
    password: z
      .string({
        required_error: "Invalid password"
      })
      .min(6, {
        message: "Password must be at least 6 characters"
      })
      .max(30, {
        message: "Password must not exceed 30 characters"
      }),
    repassword: z
      .string({
        required_error: "Invalid password"
      })
      .min(6, {
        message: "Password must be at least 6 characters"
      })
      .max(30, {
        message: "Password must not exceed 30 characters"
      }),
    roleId: z.string()
  })
  .strict()
  .superRefine(({ repassword, password }, ctx) => {
    if (repassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Password and confirm password does not match",
        path: ["repassword"]
      });
    }
  });
export type CreateUserRequestDTO = z.infer<typeof CreateUserRequestSchema>;

export const UpdateUserRequestSchema = z
  .object({
    name: z
      .string({
        required_error: "Invalid full name"
      })
      .trim()
      .min(2, {
        message: "Full name is invalid"
      })
      .max(70, {
        message: "Full name must not exceed 70 characters"
      })
      .regex(/\w+\s\w+/, { message: "Full name must be at least first name and last name" }),
    email: z.string().email(),
    password: z
      .string({
        required_error: "Invalid password"
      })
      .min(6, {
        message: "Password must be at least 6 characters"
      })
      .max(30, {
        message: "Password must not exceed 30 characters"
      }),
    repassword: z
      .string({
        required_error: "Invalid password"
      })
      .min(6, {
        message: "Password must be at least 6 characters"
      })
      .max(30, {
        message: "Password must not exceed 30 characters"
      }),
    roleId: z.string()
  })
  .strict()
  .superRefine(({ repassword, password }, ctx) => {
    if (repassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Password and confirm password does not match",
        path: ["repassword"]
      });
    }
  });
export type UpdateUserRequestDTO = z.infer<typeof UpdateUserRequestSchema>;

export type UserListType = {
  start: number;
  limit: number;
  length: number;
  total: number;
  users: UserType[];
};
