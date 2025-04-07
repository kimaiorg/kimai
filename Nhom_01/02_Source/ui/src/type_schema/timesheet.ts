import { ActivitySimpleType } from "@/type_schema/activity";
import { ProjectType } from "@/type_schema/project";
import { TaskSimpleType } from "@/type_schema/task";
import { UserType } from "@/type_schema/user.schema";
import { z } from "zod";

export type TimesheetTestType = {
  id: string;
  user_id: string;
  user_name: string;
  description?: string;
  start_time: string;
  end_time: string | null;
  duration: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  project_id: string | null;
  activity_id: string | null;
  task_id: string | null;
  status?: "running" | "stopped";
};

export type TimesheetSimpleType = {
  id: string;
  user_id: string;
  description?: string;
  start_time: string;
  end_time: string | null;
  duration: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  project: ProjectType | null;
  activity: ActivitySimpleType | null;
  task: TaskSimpleType | null;
  status?: "running" | "stopped";
};

export type TimesheetType = {
  id: string;
  user: UserType;
  description?: string;
  start_time: string;
  end_time: string | null;
  duration: string | null; // in seconds
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  task: TaskSimpleType | null;
  project: ProjectType | null;
  activity: ActivitySimpleType | null;
  status?: "running" | "stopped";
};

export const CreateTimesheetRequestSchema = z.object({
  task_id: z
    .string({
      required_error: "Task is required"
    })
    .nonempty({
      message: "Task is required"
    }),
  description: z.string().optional()
});

export type CreateTimesheetValidation = z.infer<typeof CreateTimesheetRequestSchema>;
export type CreateTimesheetRequestDTO = {
  task_id: number;
  description?: string;
  user_name: string;
  project_id: number;
  activity_id: number;
};

export const CreateManualTimesheetRequestSchema = z
  .object({
    task_id: z
      .string({
        required_error: "Task is required"
      })
      .nonempty({
        message: "Task is required"
      }),
    description: z.string().optional(),
    from: z.string().nonempty({
      message: "Start time is required"
    }),
    end: z.string().nonempty({
      message: "End time is required"
    })
  })
  .strict()
  .superRefine(({ from, end }, ctx) => {
    if (from > end) {
      ctx.addIssue({
        code: "custom",
        message: "End time must be after the start time",
        path: ["end"]
      });
    }
    if (new Date(from) > new Date()) {
      ctx.addIssue({
        code: "custom",
        message: "Start time must not be in the feature",
        path: ["from"]
      });
    }
  });

export type CreateManualTimesheetValidation = z.infer<typeof CreateManualTimesheetRequestSchema>;
export type CreateManualTimesheetRequestDTO = {
  task_id: number;
  from: string;
  description?: string;
  end: string;
  user_name: string;
  project_id: number;
  activity_id: number;
};

export const UpdateTimesheetRequestSchema = z
  .object({
    task_id: z
      .string({
        required_error: "Task is required"
      })
      .nonempty({
        message: "Task is required"
      }),
    description: z.string().optional(),
    from: z.string().nonempty({
      message: "Start time is required"
    }),
    end: z.string().optional()
  })
  .strict()
  .superRefine(({ from, end }, ctx) => {
    if (end && from > end) {
      ctx.addIssue({
        code: "custom",
        message: "End time must be after the start time",
        path: ["end"]
      });
    }
    if (new Date(from) > new Date()) {
      ctx.addIssue({
        code: "custom",
        message: "Start time must not be in the feature",
        path: ["from"]
      });
    }
  });

export type UpdateTimesheetValidation = z.infer<typeof UpdateTimesheetRequestSchema>;
export type UpdateTimesheetRequestDTO = {
  task_id: number;
  from: string;
  description?: string;
  end: string;
  user_name: string;
  project_id: number;
  activity_id: number;
};
