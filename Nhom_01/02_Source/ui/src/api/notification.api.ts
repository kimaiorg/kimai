import { getManagementAccessToken } from "@/api/auth.api";
import { Pagination } from "@/type_schema/common";
import { NotificationType } from "@/type_schema/notification";
import axios from "axios";

const NOTIFICATION_BACKEND_URL = process.env.NOTIFICATION_BACKEND_URL;

export async function getAllNotifications(
  page?: number,
  limit?: number,
  keyword?: string,
  sortBy?: string,
  sortOrder?: string
): Promise<Pagination<NotificationType>> {
  const token = await getManagementAccessToken();
  console.log(token);
  const params = new URLSearchParams();
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());
  if (keyword) params.append("keyword", keyword);
  if (sortBy) {
    params.append("sort_by", sortBy);
    const order = sortOrder === "asc" ? "asc" : "desc";
    params.append("sort_order", order);
  }

  return {
    data: [
      {
        id: "1",
        title: "New Expense Request",
        content: "John Doe has submitted a new expense request for approval.",
        type: "expense_request",
        targetId: "exp-123",
        hasRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        deleteAt: null
      },
      {
        id: "2",
        title: "Absence Request Approved",
        content: "Your absence request for vacation has been approved.",
        type: "absence_request_status",
        targetId: "abs-456",
        hasRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        deleteAt: null
      },
      {
        id: "3",
        title: "Timesheet Reminder",
        content: "Please submit your timesheet for the current week.",
        type: "timesheet_request",
        targetId: "time-789",
        hasRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        deleteAt: null
      },
      {
        id: "4",
        title: "Expense Report Rejected",
        content: "Your expense report for the business trip has been rejected. Please review and resubmit.",
        type: "expense_request_status",
        targetId: "exp-987",
        hasRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        deleteAt: null
      },
      {
        id: "5",
        title: "Absence Request Pending",
        content: "Your absence request is pending approval from your manager.",
        type: "absence_request",
        targetId: "abs-654",
        hasRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        deleteAt: null
      }
    ],

    metadata: {
      page: 1,
      limit: 10,
      total: 5,
      totalPages: 1
    }
  };
  const response = await axios.get<Pagination<NotificationType>>(
    `${NOTIFICATION_BACKEND_URL}/api/v1/notifications?${params.toString()}`,
    {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  );

  const data = response.data;
  return data;
}

export async function callMarkAsReadNotificationRequest(notificationId: string): Promise<number> {
  const token = await getManagementAccessToken();

  return 200;
  try {
    const response = await axios.post(
      `${NOTIFICATION_BACKEND_URL}/api/v1/notifications/${notificationId}/mark-as-read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.status;
  } catch (error: any) {
    return error.response.status;
  }
}
