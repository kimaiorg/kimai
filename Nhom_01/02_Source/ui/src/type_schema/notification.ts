export type NotificationTypeType =
  | "expense_request"
  | "absence_request"
  | "timesheet_request"
  | "expense_request_status"
  | "absence_request_status"
  | "timesheet_request_status";

export type NotificationType = {
  id: string;
  title: string;
  content: string;
  type: NotificationTypeType;
  targetId: string;
  hasRead: boolean;
  createdAt: string;
  updatedAt: string;
  deleteAt: string | null;
};

export type NotificationTypeOption = {
  title: string;
  description: string;
  type: NotificationTypeType;
};

export const notificationTypeOptions: NotificationTypeOption[] = [
  {
    title: "Expense Request",
    description: "Someone has requested an expense from you",
    type: "expense_request"
  },
  {
    title: "Absence Request",
    description: "Someone has requested an absence from you",
    type: "absence_request"
  },
  {
    title: "Timesheet Request",
    description: "Someone has requested a timesheet from you",
    type: "timesheet_request"
  },
  {
    title: "Expense Request Status",
    description: "The status of an expense request has changed",
    type: "expense_request_status"
  },
  {
    title: "Absence Request Status",
    description: "The status of an absence request has changed",
    type: "absence_request_status"
  },
  {
    title: "Timesheet Request Status",
    description: "The status of a timesheet request has changed",
    type: "timesheet_request_status"
  }
];
