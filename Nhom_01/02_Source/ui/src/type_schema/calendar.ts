import { TimesheetType } from "@/type_schema/timesheet";

export type CalendarConfigType = {
  initialView: string | "dayGridMonth";
  themeSystem: string | "default";
};

export type CalendarEventType = {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
  timesheet: TimesheetType;
};
