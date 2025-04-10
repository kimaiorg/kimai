import { getManagementAccessToken } from "@/api/auth.api";
import { myAxios } from "@/api/axios";
import { ReportService } from "@/db/reportService";
import { ProjectOverviewResponse, WeeklyAllUsersReportResponse, WeeklyUserReportResponse } from "@/type_schema/report";

/**
 * Get weekly report data for a specific user
 */
export async function getWeeklyUserReport(
  userId: string,
  weekNumber: number,
  year: number
): Promise<WeeklyUserReportResponse> {
  // Kiểm tra nếu đang ở môi trường client-side
  if (typeof window !== "undefined") {
    try {
      // Sử dụng ReportService để lấy dữ liệu từ localStorage
      return ReportService.getWeeklyUserReport(userId, weekNumber, year);
    } catch (error) {
      console.error("Error getting weekly user report from localStorage:", error);
      // Nếu có lỗi, tiếp tục thử gọi API
    }
  }

  // Fallback: Thử gọi API nếu localStorage không hoạt động
  try {
    const token = await getManagementAccessToken();

    const params = new URLSearchParams();
    params.append("week", weekNumber.toString());
    params.append("year", year.toString());

    const response = await myAxios.get<WeeklyUserReportResponse>(
      `/api/v1/reports/weekly/user/${userId}?${params.toString()}`,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching weekly user report from API:", error);

    // Nếu API cũng lỗi, trả về dữ liệu giả từ ReportService
    if (typeof window !== "undefined") {
      return ReportService.getWeeklyUserReport(userId, weekNumber, year);
    } else {
      // Trong trường hợp SSR, trả về đối tượng rỗng
      return {
        entries: [],
        projects: [],
        user: { id: parseInt(userId) || 1, name: "User " + userId },
        week: { number: weekNumber, year, start: "", end: "" },
        totals: { duration: 0, byDay: {}, byProject: {} }
      };
    }
  }
}

/**
 * Get weekly report data for all users
 */
export async function getWeeklyAllUsersReport(weekNumber: number, year: number): Promise<WeeklyAllUsersReportResponse> {
  // Kiểm tra nếu đang ở môi trường client-side
  if (typeof window !== "undefined") {
    try {
      // Sử dụng ReportService để lấy dữ liệu từ localStorage
      return ReportService.getWeeklyAllUsersReport(weekNumber, year);
    } catch (error) {
      console.error("Error getting weekly all users report from localStorage:", error);
      // Nếu có lỗi, tiếp tục thử gọi API
    }
  }

  // Fallback: Thử gọi API nếu localStorage không hoạt động
  try {
    const token = await getManagementAccessToken();

    const params = new URLSearchParams();
    params.append("week", weekNumber.toString());
    params.append("year", year.toString());

    const response = await myAxios.get<WeeklyAllUsersReportResponse>(
      `/api/v1/reports/weekly/all?${params.toString()}`,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching weekly all users report from API:", error);

    // Nếu API cũng lỗi, trả về dữ liệu giả từ ReportService
    if (typeof window !== "undefined") {
      return ReportService.getWeeklyAllUsersReport(weekNumber, year);
    } else {
      // Trong trường hợp SSR, trả về đối tượng rỗng
      return {
        entries: [],
        users: [],
        projects: [],
        week: { number: weekNumber, year, start: "", end: "" },
        totals: { duration: 0, byDay: {}, byUser: {} }
      };
    }
  }
}

/**
 * Get project overview report data
 */
export async function getProjectOverviewReport(customerId?: number): Promise<ProjectOverviewResponse> {
  // Kiểm tra nếu đang ở môi trường client-side
  if (typeof window !== "undefined") {
    try {
      // Sử dụng ReportService để lấy dữ liệu từ localStorage
      return ReportService.getProjectOverviewReport(customerId);
    } catch (error) {
      console.error("Error getting project overview report from localStorage:", error);
      // Nếu có lỗi, tiếp tục thử gọi API
    }
  }

  // Fallback: Thử gọi API nếu localStorage không hoạt động
  try {
    const token = await getManagementAccessToken();

    const params = new URLSearchParams();
    if (customerId) params.append("customer_id", customerId.toString());

    const response = await myAxios.get<ProjectOverviewResponse>(
      `/api/v1/reports/projects/overview?${params.toString()}`,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching project overview report from API:", error);

    // Nếu API cũng lỗi, trả về dữ liệu giả từ ReportService
    if (typeof window !== "undefined") {
      return ReportService.getProjectOverviewReport(customerId);
    } else {
      // Trong trường hợp SSR, trả về đối tượng rỗng
      return { projects: [], customers: [] };
    }
  }
}
