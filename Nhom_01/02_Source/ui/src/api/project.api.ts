import { getManagementAccessToken } from "@/api/auth.api";
import { projectAxios } from "@/api/axios";
import { Pagination } from "@/type_schema/common";
import { CreateProjectRequestDTO, ProjectType, UpdateProjectRequestDTO } from "@/type_schema/project";

export async function getAllProjects(
  page?: number,
  perPage?: number,
  keyword?: string,
  sortBy?: string,
  sortOrder?: string,
  customerId?: string,
  teamId?: string,
  budgetFrom?: string,
  budgetTo?: string
): Promise<Pagination<ProjectType>> {
  const token = await getManagementAccessToken();

  const params = new URLSearchParams();
  if (page) params.append("page", page.toString());
  if (perPage) params.append("limit", perPage.toString());
  if (keyword) params.append("keyword", keyword);
  if (sortBy) {
    params.append("sort_by", sortBy);
    const order = sortOrder === "asc" ? "asc" : "desc";
    params.append("sort_order", order);
  }
  if (customerId) params.append("customer_id", customerId.toString());
  if (teamId) params.append("team_id", teamId.toString());
  if (budgetFrom) params.append("budget_from", budgetFrom.toString());
  if (budgetTo) params.append("budget_from", budgetTo.toString());
  const response = await projectAxios.get<Pagination<ProjectType>>(`/api/v1/projects?${params.toString()}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  const data = response.data;
  return data;
}

export async function addNewProject(request: CreateProjectRequestDTO): Promise<number> {
  const token = await getManagementAccessToken();
  const payload = { ...request };
  try {
    const response = await projectAxios.post(`/api/v1/projects`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.status;
  } catch (error: any) {
    return error.response.status;
  }
}

export async function updateProject(request: UpdateProjectRequestDTO, projectId: number): Promise<number> {
  const token = await getManagementAccessToken();
  const payload = { ...request };
  try {
    const response = await projectAxios.put(`/api/v1/projects/${projectId}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.status;
  } catch (error: any) {
    return error.response.status;
  }
}
