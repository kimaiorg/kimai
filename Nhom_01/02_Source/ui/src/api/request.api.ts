import { getManagementAccessToken } from "@/api/auth.api";
import { projectAxios } from "@/api/axios";
import { TaskExpenseUpdateRequestType } from "@/type_schema/task";
import { TimesheetUpdateRequestType } from "@/type_schema/timesheet";

export async function confirmUpdateTimesheet(timesheetUpdate: TimesheetUpdateRequestType, id: string): Promise<number> {
  const token = await getManagementAccessToken();

  return 200;
  try {
    const response = await projectAxios.put(`/api/v1/timesheet/request/${id}/confirm`, timesheetUpdate, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.status;
  } catch (error: any) {
    return error.response.status;
  }
}

export async function rejectUpdateTimesheet(timesheetUpdate: TimesheetUpdateRequestType, id: string): Promise<number> {
  const token = await getManagementAccessToken();

  return 200;
  try {
    const response = await projectAxios.put(
      `/api/v1/timesheet/request/${id}/reject`,
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

export async function confirmUpdateTask(taskExpense: TaskExpenseUpdateRequestType, id: string): Promise<number> {
  const token = await getManagementAccessToken();

  return 200;
  try {
    const response = await projectAxios.put(`/api/v1/tasks/request/${id}/confirm`, taskExpense, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.status;
  } catch (error: any) {
    return error.response.status;
  }
}

export async function rejectUpdateTask(taskExpense: TaskExpenseUpdateRequestType, id: string): Promise<number> {
  const token = await getManagementAccessToken();

  return 200;
  try {
    const response = await projectAxios.put(
      `/api/v1/tasks/request/${id}/reject`,
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
