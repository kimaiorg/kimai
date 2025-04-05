import { getManagementAccessToken } from "@/api/auth.api";
import { myAxios } from "@/api/axios";
import { ActivityType, CreateActivityRequestDTO } from "@/type_schema/activity";
import { Pagination } from "@/type_schema/common";

export async function getAllActivities(
  page?: number,
  limit?: number,
  keyword?: string,
  sortBy?: string,
  sortOrder?: string
): Promise<Pagination<ActivityType>> {
  const token = await getManagementAccessToken();

  const params = new URLSearchParams();
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());
  if (keyword) params.append("keyword", keyword);
  if (sortBy) {
    params.append("sortBy", sortBy);
    const order = sortOrder === "asc" ? "asc" : "desc";
    params.append("sortOrder", order);
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
