import { getManagementAccessToken } from "@/api/auth.api";
import { timesheetAxios } from "@/api/axios";
import { Pagination } from "@/type_schema/common";
import { ApprovalStatus, RequestTypeType, RequestUpdateType } from "@/type_schema/request";
import {
  CreateManualTimesheetRequestDTO,
  CreateTimesheetRequestDTO,
  TimesheetResponseType,
  TimesheetUpdateRequestType
} from "@/type_schema/timesheet";

export async function getAllTimesheets(
  page?: number,
  limit?: number,
  keyword?: string,
  sortBy?: string,
  sortOrder?: string
): Promise<Pagination<TimesheetResponseType>> {
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

  const response = await timesheetAxios.get<Pagination<TimesheetResponseType>>(
    `/api/v1/timesheets?${params.toString()}`,
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

export async function getAllMyTimesheets(
  page?: number,
  limit?: number,
  keyword?: string,
  sortBy?: string,
  sortOrder?: string,
  fromDate?: string,
  toDate?: string,
  userId?: string,
  projectId?: string,
  activityId?: string,
  taskId?: string,
  status?: string
): Promise<Pagination<TimesheetResponseType>> {
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
  if (fromDate) params.append("from_date", fromDate);
  if (toDate) params.append("to_date", toDate);
  if (userId) params.append("user_id", userId);
  if (projectId) params.append("project_id", projectId);
  if (activityId) params.append("activity_id", activityId);
  if (taskId) params.append("task_id", taskId);
  if (status) params.append("status", status);

  const response = await timesheetAxios.get<Pagination<TimesheetResponseType>>(
    `/api/v1/timesheets/me?${params.toString()}`,
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

export async function addNewTimesheetRecord(request: CreateTimesheetRequestDTO): Promise<number> {
  const token = await getManagementAccessToken();
  const payload = { ...request };
  try {
    const response = await timesheetAxios.post(`/api/v1/timesheets/start`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.status;
  } catch (error: any) {
    return error.response.status;
  }
}

export async function endTimesheetRecord(): Promise<number> {
  const token = await getManagementAccessToken();

  try {
    const response = await timesheetAxios.post(
      `/api/v1/timesheets/end`,
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

export async function addNewManualTimesheetRecord(request: CreateManualTimesheetRequestDTO): Promise<number> {
  const token = await getManagementAccessToken();
  const payload = { ...request };
  try {
    const response = await timesheetAxios.post(`/api/v1/timesheets`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.status;
  } catch (error: any) {
    return error.response.status;
  }
}

export async function getAllMyTimesheetUpdateRequests(
  page?: number,
  limit?: number,
  keyword?: string,
  sortBy?: string,
  sortOrder?: string,
  fromDate?: string,
  toDate?: string,
  userId?: string,
  projectId?: string,
  activityId?: string,
  taskId?: string,
  status?: string
): Promise<Pagination<RequestUpdateType<TimesheetResponseType, TimesheetUpdateRequestType>>> {
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
  if (fromDate) params.append("from_date", fromDate);
  if (toDate) params.append("to_date", toDate);
  if (userId) params.append("user_id", userId);
  if (projectId) params.append("project_id", projectId);
  if (activityId) params.append("activity_id", activityId);
  if (taskId) params.append("task_id", taskId);
  if (status) params.append("status", status);

  // Fake data
  const responseFake = await getAllMyTimesheets();
  const { metadata, data: dataFake } = responseFake;
  return {
    metadata,
    data: dataFake.map((timesheet, index) => {
      return {
        id: index + 1,
        type: RequestTypeType.START_TIMESHEET,
        comment: "A comment",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
        previous_data: timesheet,
        request_data: {
          new_start_time: new Date(2025, 5, 11, 7, 0).toISOString(),
          new_end_time: new Date(2025, 5, 11, 17, 0).toISOString()
        },
        status: Math.random() > 0.5 ? ApprovalStatus.PROCESSING : ApprovalStatus.APPROVED
      };
    })
  };

  const response = await timesheetAxios.get<
    Pagination<RequestUpdateType<TimesheetResponseType, TimesheetUpdateRequestType>>
  >(`/api/v1/timesheets/request?${params.toString()}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  const data = response.data;
  return data;
}
