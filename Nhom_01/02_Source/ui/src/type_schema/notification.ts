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
