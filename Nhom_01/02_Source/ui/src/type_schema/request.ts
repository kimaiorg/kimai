import { ExpenseType } from "@/type_schema/expense";
import { TimesheetResponseType } from "@/type_schema/timesheet";
import { ComponentType } from "react";

export enum ApprovalStatus {
  PROCESSING = "PROCESSING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

export enum RequestTypeType {
  CHANGE_EXPENSE_QUANTITY = "CHANGE_EXPENSE_QUANTITY",
  START_TIMESHEET = "START_TIMESHEET",
  ABSENCE = "ABSENCE"
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
  type: RequestTypeType;
  comment: string;
  status: ApprovalStatus;
  previous_data: T;
  request_data: V;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
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
