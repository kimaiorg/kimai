import { getManagementAccessToken } from "@/api/auth.api";
import { myAxios } from "@/api/axios";
import { Pagination } from "@/type_schema/common";
import {
  ProjectOverviewResponse,
  ReportFilter,
  WeeklyAllUsersReportResponse,
  WeeklyReportEntry,
  WeeklyUserReportResponse
} from "@/type_schema/report";

/**
 * Get weekly report data for a specific user
 */
export async function getWeeklyUserReport(
  userId: string,
  weekNumber: number,
  year: number
): Promise<WeeklyUserReportResponse> {
  const token = await getManagementAccessToken();

  const params = new URLSearchParams();
  params.append("week", weekNumber.toString());
  params.append("year", year.toString());

  const mockResponse: WeeklyUserReportResponse = {
    entries: [
      { id: 1, project_id: 1, user_id: 1, duration: 26460, date: `${year}-04-07` },
      { id: 2, project_id: 2, user_id: 1, duration: 26460, date: `${year}-04-10` },
      { id: 3, project_id: 3, user_id: 1, duration: 26460, date: `${year}-04-10` },
      { id: 4, project_id: 4, user_id: 1, duration: 48300, date: `${year}-04-13` },
      { id: 5, project_id: 5, user_id: 1, duration: 48300, date: `${year}-04-13` },
      { id: 6, project_id: 6, user_id: 1, duration: 48300, date: `${year}-04-13` }
    ],
    projects: [
      { id: 1, name: "Effertz, Ortiz and Cronin", color: "red" },
      { id: 2, name: "Voluptate et", color: "yellow" },
      { id: 3, name: "Suscipit dolor", color: "pink" },
      { id: 4, name: "Willms-Champlin", color: "blue" },
      { id: 5, name: "Quidem recusandae", color: "blue" },
      { id: 6, name: "Rerum quos", color: "orange" }
    ],
    user: {
      id: 1,
      name: "Anna Smith"
    },
    week: {
      number: weekNumber,
      year: year,
      start: `${year}-04-05`,
      end: `${year}-04-11`
    },
    totals: {
      duration: 224340,
      byDay: {
        [`${year}-04-07`]: 26460,
        [`${year}-04-10`]: 52920,
        [`${year}-04-13`]: 144900
      },
      byProject: {
        1: 26460,
        2: 26460,
        3: 26460,
        4: 48300,
        5: 48300,
        6: 48300
      }
    }
  };

  return mockResponse;

  /*
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
  */
}

/**
 * Get weekly report data for all users
 */
export async function getWeeklyAllUsersReport(weekNumber: number, year: number): Promise<WeeklyAllUsersReportResponse> {
  const token = await getManagementAccessToken();

  const params = new URLSearchParams();
  params.append("week", weekNumber.toString());
  params.append("year", year.toString());

  // For now, we'll return mock data
  // In the future, this will be replaced with an actual API call
  const mockResponse: WeeklyAllUsersReportResponse = {
    entries: [
      { id: 1, user_id: 1, project_id: 1, duration: 26460, date: `${year}-04-07` },
      { id: 2, user_id: 1, project_id: 2, duration: 26460, date: `${year}-04-10` },
      { id: 3, user_id: 2, project_id: 3, duration: 26460, date: `${year}-04-10` },
      { id: 4, user_id: 3, project_id: 4, duration: 48300, date: `${year}-04-13` },
      { id: 5, user_id: 4, project_id: 5, duration: 48300, date: `${year}-04-13` },
      { id: 6, user_id: 2, project_id: 6, duration: 48300, date: `${year}-04-13` },
      { id: 7, user_id: 1, project_id: 3, duration: 26460, date: `${year}-04-10` },
      { id: 8, user_id: 3, project_id: 2, duration: 26460, date: `${year}-04-10` },
      { id: 9, user_id: 4, project_id: 1, duration: 26460, date: `${year}-04-10` }
    ],
    users: [
      { id: 1, name: "Anna Smith", role: "Administrator" },
      { id: 2, name: "John Doe", role: "Developer" },
      { id: 3, name: "Jane Wilson", role: "Designer" },
      { id: 4, name: "Robert Brown", role: "Manager" }
    ],
    week: {
      number: weekNumber,
      year: year,
      start: `${year}-04-05`,
      end: `${year}-04-11`
    },
    totals: {
      duration: 303660,
      byDay: {
        [`${year}-04-07`]: 26460,
        [`${year}-04-10`]: 132300,
        [`${year}-04-13`]: 144900
      },
      byUser: {
        1: 79380,
        2: 74760,
        3: 74760,
        4: 74760
      }
    }
  };

  return mockResponse;

  // Actual API call (to be implemented later)
  /*
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
  */
}

/**
 * Get project overview report data
 */
export async function getProjectOverviewReport(customerId?: number): Promise<ProjectOverviewResponse> {
  const token = await getManagementAccessToken();

  const params = new URLSearchParams();
  if (customerId) params.append("customer_id", customerId.toString());

  const mockResponse: ProjectOverviewResponse = {
    projects: [
      {
        id: 1,
        customer_id: 1,
        customer_name: "Becker-Schultz",
        name: "Adipisci aut",
        hourly_quota: 177.55,
        budget: 43090.97,
        spent: 0.75 * 43090.97,
        time_spent: 554.28,
        last_entry: "2025-04-09",
        this_month: 0.09,
        total: 0.09,
        not_exported: 0.09,
        not_billed: 43090.97,
        budget_used_percentage: 0.75,
        color: "green"
      },
      {
        id: 2,
        customer_id: 1,
        customer_name: "Becker-Schultz",
        name: "Consequatur ratione",
        hourly_quota: 730.54,
        budget: 48572.68,
        spent: 1.0 * 48572.68,
        time_spent: 730.54,
        last_entry: "2025-04-19",
        this_month: 0.12,
        total: 0.12,
        not_exported: 0.12,
        not_billed: 0,
        budget_used_percentage: 1.0,
        color: "pink"
      },
      {
        id: 3,
        customer_id: 1,
        customer_name: "Becker-Schultz",
        name: "Est sequi",
        hourly_quota: 888.53,
        budget: 52252.08,
        spent: 1.25 * 52252.08,
        time_spent: 888.53,
        last_entry: "2025-04-22",
        this_month: 0.14,
        total: 0.14,
        not_exported: 0.14,
        not_billed: 0,
        budget_used_percentage: 1.25,
        color: "yellow"
      },
      {
        id: 4,
        customer_id: 1,
        customer_name: "Becker-Schultz",
        name: "Est voluptatem",
        hourly_quota: 1218.08,
        budget: 77692.83,
        spent: 1.8 * 77692.83,
        time_spent: 1218.08,
        last_entry: "2025-04-15",
        this_month: 0.2,
        total: 0.2,
        not_exported: 0.2,
        not_billed: 0,
        budget_used_percentage: 1.8,
        color: "blue"
      },
      {
        id: 5,
        customer_id: 1,
        customer_name: "Becker-Schultz",
        name: "Extreme Overbudget",
        hourly_quota: 500.0,
        budget: 25000.0,
        spent: 3.0 * 25000.0,
        time_spent: 1500.0,
        last_entry: "2025-04-08",
        this_month: 0.3,
        total: 0.3,
        not_exported: 0.3,
        not_billed: 0,
        budget_used_percentage: 3.0,
        color: "red"
      }
    ],
    customers: [
      { id: 1, name: "Becker-Schultz" },
      { id: 2, name: "Willms Inc." },
      { id: 3, name: "Effertz Group" }
    ]
  };

  // Filter projects by customer ID if provided
  if (customerId) {
    mockResponse.projects = mockResponse.projects.filter((project) => project.customer_id === customerId);
  }

  return mockResponse;

  // Actual API call (to be implemented later)
  /*
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
  */
}
