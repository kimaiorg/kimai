import { getManagementAccessToken } from "@/api/auth.api";
import { Pagination } from "@/type_schema/common";
import { NotificationType } from "@/type_schema/notification";
import { notificationAxios } from "@/api/axios";

export async function getAllNotifications(
  page?: number,
  limit?: number,
  keyword?: string,
  sortBy?: string,
  sortOrder?: string,
  startDate?: string,
  endDate?: string,
  type?: string,
  hasRead?: string
): Promise<Pagination<NotificationType>> {
  const token = await getManagementAccessToken();

  const params = new URLSearchParams();
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());
  if (keyword) params.append("keyword", keyword);
  if (sortBy) {
    params.append("sort_by", sortBy);
    const order = sortOrder === "asc" ? "asc" : "desc";
    params.append("sort_order", order);
  }
  if (startDate) params.append("start_date", startDate);
  if (endDate) params.append("end_date", endDate);
  if (type) params.append("type", type);
  if (hasRead) params.append("has_read", hasRead.toString());

  const response = await notificationAxios.get<Pagination<NotificationType>>(
    `/api/v1/notifications?${params.toString()}`,
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

  try {
    const response = await notificationAxios.put(
      `/api/v1/notifications/${notificationId}`,
      { hasRead: true },
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
