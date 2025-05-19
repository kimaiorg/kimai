export enum NotificationTypeType {
  EXPENSE_REQUEST = "expense_request",
  ABSENCE_REQUEST = "absence_request",
  TIMESHEET_REQUEST = "timesheet_request",
  EXPENSE_REQUEST_STATUS = "expense_request_status",
  ABSENCE_REQUEST_STATUS = "absence_request_status",
  TIMESHEET_REQUEST_STATUS = "timesheet_request_status",
  CHANGE_STATUS_REQUEST = "change_status_request"
}

export type NotificationType = {
  id: number;
  title: string;
  content: string;
  type: NotificationTypeType;
  target_id: string;
  user_id: string;
  has_read: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
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
    type: NotificationTypeType.EXPENSE_REQUEST
  },
  {
    title: "Absence Request",
    description: "Someone has requested an absence from you",
    type: NotificationTypeType.ABSENCE_REQUEST
  },
  {
    title: "Timesheet Request",
    description: "Someone has requested a timesheet from you",
    type: NotificationTypeType.TIMESHEET_REQUEST
  },
  {
    title: "Expense Request Status",
    description: "The status of an expense request has changed",
    type: NotificationTypeType.EXPENSE_REQUEST_STATUS
  },
  {
    title: "Absence Request Status",
    description: "The status of an absence request has changed",
    type: NotificationTypeType.ABSENCE_REQUEST_STATUS
  },
  {
    title: "Timesheet Request Status",
    description: "The status of a timesheet request has changed",
    type: NotificationTypeType.TIMESHEET_REQUEST_STATUS
  }
];
