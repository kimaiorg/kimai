import { getManagementAccessToken } from "@/api/auth.api";
import { projectAxios } from "@/api/axios";
import { Pagination } from "@/type_schema/common";
import { RequestUpdateType } from "@/type_schema/request";
import { TaskUpdateStatusRequestType } from "@/type_schema/task";
import { TimesheetUpdateStatusRequestType } from "@/type_schema/timesheet";

export async function confirmUpdateTimesheet(
  timesheetUpdate: TimesheetUpdateStatusRequestType,
  requestId: string
): Promise<number> {
  const token = await getManagementAccessToken();

  try {
    const response = await projectAxios.put(`/api/v1/requests/${requestId}`, timesheetUpdate, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.status;
  } catch (error: any) {
    return error.response.status;
  }
}

export async function rejectUpdateTimesheet(
  timesheetUpdate: TimesheetUpdateStatusRequestType,
  requestId: string
): Promise<number> {
  const token = await getManagementAccessToken();

  try {
    const response = await projectAxios.put(`/api/v1/requests/${requestId}`, timesheetUpdate, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.status;
  } catch (error: any) {
    return error.response.status;
  }
}

export async function confirmUpdateTask(taskStatus: TaskUpdateStatusRequestType, id: string): Promise<number> {
  const token = await getManagementAccessToken();

  try {
    const response = await projectAxios.put(`/api/v1/requests/${id}`, taskStatus, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.status;
  } catch (error: any) {
    return error.response.status;
  }
}

export async function rejectUpdateTask(taskStatus: TaskUpdateStatusRequestType, id: string): Promise<number> {
  const token = await getManagementAccessToken();

  try {
    const response = await projectAxios.put(`/api/v1/requests/${id}`, taskStatus, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.status;
  } catch (error: any) {
    return error.response.status;
  }
}

export async function getAllExpenseUpdates<T, V>(
  type: string | null,
  page?: number,
  limit?: number,
  keyword?: string,
  sortBy?: string,
  sortOrder?: string,
  teamId?: string,
  userId?: string
): Promise<Pagination<RequestUpdateType<T, V>>> {
  const token = await getManagementAccessToken();

  const params = new URLSearchParams();
  if (type) params.append("type", type);
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());
  if (keyword) params.append("keyword", keyword);
  if (sortBy) {
    params.append("sort_by", sortBy);
    const order = sortOrder === "asc" ? "asc" : "desc";
    params.append("sort_order", order);
  }
  if (teamId) params.append("team_id", teamId);
  if (userId) params.append("user_id", userId);

  const response = await projectAxios.get<Pagination<RequestUpdateType<T, V>>>(
    `/api/v1/requests?${params.toString()}`,
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
