import { ActivityType } from "@/type_schema/activity";
import { ProjectType } from "@/type_schema/project";
import { ApprovalStatus } from "@/type_schema/request";
import { TaskResponseType } from "@/type_schema/task";
import { UserType } from "@/type_schema/user.schema";
import { z } from "zod";

export enum TimesheetStatus {
  TRACKING = "running",
  TRACKED = "stopped"
}

export type TimesheetResponseType = {
  id: number;
  description: string;
  status: TimesheetStatus;
  request_status: ApprovalStatus;
  start_time: string;
  end_time: null;
  duration: number;
  user_id: string;
  username: string;
  project_id: number;
  activity_id: number;
  task_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type TimesheetType = {
  id: number;
  description: string;
  start_time: string;
  end_time: null;
  duration: number;
  user: UserType;
  username: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  task: TaskResponseType | null;
  project: ProjectType | null;
  activity: ActivityType | null;
  status: TimesheetStatus;
  request_status: ApprovalStatus;
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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TimesheetStartTrackingRequestType = {};

export type TimesheetUpdateRequestType = {
  new_start_time: string;
  new_end_time: string;
};

export type TimesheetUpdateStatusRequestType = {
  status: ApprovalStatus.APPROVED | ApprovalStatus.REJECTED;
};
