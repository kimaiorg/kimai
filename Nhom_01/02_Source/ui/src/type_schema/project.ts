import { string, z } from "zod";

export interface ProjectType {
  id: 7;
  name: string;
  color: string;
  project_number: number;
  order_number: number;
  order_date: string;
  start_date: string;
  end_date: string;
  budget: number;
  teams: {
    id: number;
    name: string;
  }[];
  customer: {
    id: number;
    name: string;
    company_name: string;
  };
}

export const CreateProjectRequestSchema = z
  .object({
    name: z.string().min(5).max(255),
    color: z.string(),
    project_number: z.string(),
    order_number: z.string(),
    order_date: z.string(),
    start_date: z.string(),
    end_date: z.string(),
    budget: z.string(),
    customer: string()
  })
  .strict()
  .superRefine(({ start_date, end_date }, ctx) => {
    if (start_date > end_date) {
      ctx.addIssue({
        code: "custom",
        message: "End time must be after the start time",
        path: ["end_date"]
      });
    }
  });

export type CreateProjectValidation = z.infer<typeof CreateProjectRequestSchema>;

export type CreateProjectRequestDTO = {
  name: string;
  color: string;
  project_number: number;
  order_number: number;
  order_date: string;
  start_date: string;
  end_date: string;
  budget: number;
  teams: number[];
  customer: number;
};
