import { TeamResponseType } from "@/type_schema/team";
import { TimesheetResponseType } from "@/type_schema/timesheet";
import { UserType } from "@/type_schema/user.schema";
import { ComponentType } from "react";

export enum ApprovalStatus {
  PROCESSING = "PROCESSING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

export enum RequestTypeType {
  CHANGE_EXPENSE_QUANTITY = "CHANGE_EXPENSE_QUANTITY",
  START_TIMESHEET = "START_TIMESHEET",
  TIMESHEET_REQUEST_STATUS = "timesheet_request_status",
  ABSENCE_REQUEST_STATUS = "absence_request_status"
}

export type RequestViewType = {
  id: string;
  title: string;
  icon: React.ReactNode;
  component: ComponentType<any>;
  background: string;
  description: string;
  textColor: string;
};

export type RequestUpdateType<T, V> = {
  id: number;
  comment: string;
  type: RequestTypeType;
  status: ApprovalStatus;
  target_id: number;
  user_id: string;
  user?: UserType;
  team_id?: number;
  team?: TeamResponseType;
  previous_data: T;
  request_data: V;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type CommonRequestType<T> = {
  comment: string;
  type: RequestTypeType;
  target_id: number;
  team_id: number;
  request_data: T;
};

export type TimesheetRequestType = {
  id: number;
  created_at: string;
  updated_at: string;
  timesheet: TimesheetResponseType;
};

export type AbsenceRequestType = {
  id: number;
  absence: any;
  created_at: string;
  updated_at: string;
};
