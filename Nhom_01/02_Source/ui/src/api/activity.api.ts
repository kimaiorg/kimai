import { getManagementAccessToken } from "@/api/auth.api";
import { myAxios } from "@/api/axios";
import { ActivityType, CreateActivityRequestDTO, UpdateActivityRequestDTO } from "@/type_schema/activity";
import { Pagination } from "@/type_schema/common";

export async function getAllActivities(
  page?: number,
  limit?: number,
  keyword?: string,
  sortBy?: string,
  sortOrder?: string,
  projectId?: string,
  teamId?: string,
  budgetFrom?: string,
  budgetTo?: string
): Promise<Pagination<ActivityType>> {
  const token = await getManagementAccessToken();

  const params = new URLSearchParams();
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());
  if (keyword) params.append("keyword", keyword);
  if (projectId) params.append("project_id", projectId);
  if (teamId) params.append("team_id", teamId);
  if (budgetFrom) params.append("budget_from", budgetFrom);
  if (budgetTo) params.append("budget_to", budgetTo);
  if (sortBy) {
    params.append("sort_by", sortBy);
    if (sortOrder) {
      params.append("sort_order", sortOrder);
    }
  }
  const response = await myAxios.get<Pagination<ActivityType>>(`/api/v1/activities?${params.toString()}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  const data = response.data;
  return data;
}

export async function addNewActivity(request: CreateActivityRequestDTO): Promise<number> {
  const token = await getManagementAccessToken();
  const payload = { ...request };
  try {
    const response = await myAxios.post(`/api/v1/activities`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.status;
  } catch (error: any) {
    return error.response.status;
  }
}

export async function updateActivity(request: UpdateActivityRequestDTO, id: number): Promise<number> {
  const token = await getManagementAccessToken();
  const payload = { ...request };
  try {
    const response = await myAxios.put(`/api/v1/activities/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.status;
  } catch (error: any) {
    return error.response.status;
  }
}
