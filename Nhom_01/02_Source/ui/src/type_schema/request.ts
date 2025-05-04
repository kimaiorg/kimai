import { ExpenseType } from "@/type_schema/expense";
import { TimesheetResponseType } from "@/type_schema/timesheet";
import { ComponentType } from "react";

export type RequestViewType = {
  id: string;
  title: string;
  icon: React.ReactNode;
  component: ComponentType<any>;
  background: string;
  description: string;
  textColor: string;
};

export type TimesheetRequestType = {
  id: number;
  created_at: string;
  updated_at: string;
  timesheet: TimesheetResponseType;
};

export type ExpenseRequestType = {
  id: number;
  expense: ExpenseType;
  created_at: string;
  updated_at: string;
};

export type AbsenceRequestType = {
  id: number;
  absence: any;
  created_at: string;
  updated_at: string;
};
