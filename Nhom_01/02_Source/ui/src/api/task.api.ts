import { getManagementAccessToken } from "@/api/auth.api";
import { projectAxios } from "@/api/axios";
import { getAllExpenseUpdates } from "@/api/request.api";
import { Pagination } from "@/type_schema/common";
import { CommonRequestType, RequestTypeType, RequestUpdateType } from "@/type_schema/request";
import {
  CreateTaskRequestDTO,
  TaskExpenseUpdateRequestType,
  TaskResponseType,
  UpdateTaskRequestDTO
} from "@/type_schema/task";

export async function getAllTasks(
  page?: number,
  limit?: number,
  keyword?: string,
  sortBy?: string,
  sortOrder?: string,
  activityId?: string,
  userId?: string
): Promise<Pagination<TaskResponseType>> {
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
  if (activityId) params.append("activity_id", activityId);
  if (userId) params.append("user_id", userId);

  const response = await projectAxios.get<Pagination<TaskResponseType>>(`/api/v1/tasks?${params.toString()}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  const data = response.data;
  return data;
}

export async function getAllTasksByUserId(userId: string): Promise<TaskResponseType[]> {
  const token = await getManagementAccessToken();
  console.log(userId);
  const response = await projectAxios.get<Pagination<TaskResponseType>>(`/api/v1/tasks`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  const result = response.data;
  return result.data;
}

export async function addNewTask(request: CreateTaskRequestDTO): Promise<number> {
  const token = await getManagementAccessToken();
  const payload = { ...request };
  try {
    const response = await projectAxios.post(`/api/v1/tasks`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.status;
  } catch (error: any) {
    return error.response.status;
  }
}

export async function updateTask(request: UpdateTaskRequestDTO, taskId: number): Promise<number> {
  const token = await getManagementAccessToken();
  const payload = { ...request };
  try {
    const response = await projectAxios.put(`/api/v1/tasks/${taskId}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.status;
  } catch (error: any) {
    return error.response.status;
  }
}

export async function confirmTaskStatus(request: any, taskId: number): Promise<number> {
  const token = await getManagementAccessToken();

  return 200;
  try {
    const response = await projectAxios.put(`/api/v1/tasks/${taskId}/status`, request, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.status;
  } catch (error: any) {
    return error.response.status;
  }
}

export async function requestUpdateTaskExpense(
  request: CommonRequestType<TaskExpenseUpdateRequestType>
): Promise<number> {
  const token = await getManagementAccessToken();

  try {
    const response = await projectAxios.post(`/api/v1/requests`, request, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.status;
  } catch (error: any) {
    return error.response.status;
  }
}

export async function getAllExpenseUpdateTasks(
  page?: number,
  limit?: number,
  keyword?: string,
  sortBy?: string,
  sortOrder?: string,
  teamId?: string,
  userId?: string
): Promise<Pagination<RequestUpdateType<TaskResponseType, TaskExpenseUpdateRequestType>>> {
  return getAllExpenseUpdates(
    RequestTypeType.CHANGE_EXPENSE_QUANTITY,
    page,
    limit,
    keyword,
    sortBy,
    sortOrder,
    teamId,
    userId
  );
}
