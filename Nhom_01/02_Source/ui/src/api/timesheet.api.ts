import { getManagementAccessToken } from "@/api/auth.api";
import { myAxios } from "@/api/axios";
import { Pagination } from "@/type_schema/common";
import { UpdateTaskRequestDTO } from "@/type_schema/task";
import {
  CreateManualTimesheetRequestDTO,
  CreateTimesheetRequestDTO,
  TimesheetResponseType
} from "@/type_schema/timesheet";
import axios from "axios";

const TIMESHEET_BACKEND_URL = process.env.TIMESHEET_BACKEND_URL;

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

  const response = await axios.get<Pagination<TimesheetResponseType>>(
    `${TIMESHEET_BACKEND_URL}/api/v1/timesheets?${params.toString()}`,
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
  sortOrder?: string
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

  const response = await axios.get<Pagination<TimesheetResponseType>>(
    `${TIMESHEET_BACKEND_URL}/api/v1/timesheets/me?${params.toString()}`,
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
    const response = await axios.post(`${TIMESHEET_BACKEND_URL}/api/v1/timesheets/start`, payload, {
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
    const response = await axios.post(
      `${TIMESHEET_BACKEND_URL}/api/v1/timesheets/end`,
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
    const response = await axios.post(`${TIMESHEET_BACKEND_URL}/api/v1/timesheets`, payload, {
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
    const response = await myAxios.put(`/api/v1/tasks/${taskId}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.status;
  } catch (error: any) {
    return error.response.status;
  }
}
