import { getManagementAccessToken } from "@/api/auth.api";
import { projectAxios, reportAxios } from "@/api/axios";
import { Pagination } from "@/type_schema/common";
import {
  ProjectOverviewResponse,
  WeeklyAllUsersReportResponse,
  WeeklyAllUsersReportResponseType,
  WeeklyOneUserReportResponseType,
  WeeklyReportEntry
} from "@/type_schema/report";

export async function getWeeklyOneUserReport(
  userId: string,
  fromDate: string,
  toDate: string
): Promise<WeeklyOneUserReportResponseType> {
  const token = await getManagementAccessToken();

  const params = new URLSearchParams();
  params.append("userId", userId);
  params.append("fromDate", fromDate);
  params.append("toDate", toDate);

  const response = await reportAxios.get<WeeklyOneUserReportResponseType>(
    `/api/v1/reports/one-user?${params.toString()}`,
    {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  );

  const data = response.data;
  console.log(data);
  return data;
}

export async function getWeeklyAllUsersReport(
  fromDate: string,
  toDate: string
): Promise<Pagination<WeeklyAllUsersReportResponseType>> {
  const token = await getManagementAccessToken();

  const params = new URLSearchParams();
  params.append("fromDate", fromDate);
  params.append("toDate", toDate);

  const response = await reportAxios.get<Pagination<WeeklyAllUsersReportResponseType>>(
    `/api/v1/reports/all-users?${params.toString()}`,
    {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  );

  const data = response.data;
  console.log(data);
  return data;
}

export async function getProjectOverviewReport(customerId?: number): Promise<ProjectOverviewResponse> {
  const token = await getManagementAccessToken();

  const params = new URLSearchParams();
  if (customerId) params.append("customer_id", customerId.toString());

  const response = await projectAxios.get<ProjectOverviewResponse>(
    `/api/v1/reports/projects/overview?${params.toString()}`,
    {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
}

export async function getDashboardReport(userId: string): Promise<any> {
  const token = await getManagementAccessToken();

  const response = await reportAxios.get<any>(`/api/v1/reports/dashboard/${userId}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  return response.data;
}


// Function to load weekly all users report data from localStorage
export function loadWeeklyAllUsersReportFromLocalStorage(
  weekNumber: number,
  year: number
): WeeklyAllUsersReportResponse {
  const key = `weekly_all_users_report_${weekNumber}_${year}`;
  const storedData = localStorage.getItem(key);

  if (storedData) {
    return JSON.parse(storedData);
  }

  // Generate mock data if no data exists
  const mockData = generateMockWeeklyAllUsersReport(weekNumber, year);
  localStorage.setItem(key, JSON.stringify(mockData));
  return mockData;
}

// Function to load project overview report data from localStorage
export function loadProjectOverviewReportFromLocalStorage(customerId?: number): ProjectOverviewResponse {
  const key = `project_overview_report${customerId ? `_${customerId}` : ""}`;
  const storedData = localStorage.getItem(key);

  if (storedData) {
    return JSON.parse(storedData);
  }

  // Generate mock data if no data exists
  const mockData = generateMockProjectOverviewReport(customerId);
  localStorage.setItem(key, JSON.stringify(mockData));
  return mockData;
}

// Helper function to generate dates for a specific week
function getWeekDates(weekNumber: number, year: number) {
  // Get the first day of the year
  const firstDayOfYear = new Date(year, 0, 1);

  // Get the first day of the week (Monday) for the given week number
  const firstDayOfWeek = new Date(year, 0, 1 + (weekNumber - 1) * 7);
  while (firstDayOfWeek.getDay() !== 1) {
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - 1);
  }

  // Generate dates for the entire week
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(firstDayOfWeek);
    date.setDate(firstDayOfWeek.getDate() + i);
    weekDates.push(date.toISOString().split("T")[0]); // Format as YYYY-MM-DD
  }

  return {
    weekDates,
    startDate: weekDates[0],
    endDate: weekDates[6]
  };
}

// Generate mock weekly user report
function generateMockWeeklyUserReport(userId: string, weekNumber: number, year: number): WeeklyUserReportResponse {
  const { weekDates, startDate, endDate } = getWeekDates(weekNumber, year);

  // Mock projects
  const projects = [
    { id: 1, name: "Effertz, Ortiz and Cronin", color: "red" },
    { id: 2, name: "Voluptate et", color: "yellow" },
    { id: 3, name: "Suscipit dolor", color: "pink" },
    { id: 4, name: "Willms-Champlin", color: "blue" },
    { id: 5, name: "Quidem recusandae", color: "green" },
    { id: 6, name: "Rerum quos", color: "orange" }
  ];

  // Generate entries for random days in the week
  const entries: WeeklyReportEntry[] = [];
  const byDay: Record<string, number> = {};
  const byProject: Record<number, number> = {};
  let totalDuration = 0;

  projects.forEach((project) => {
    // Randomly select 1-3 days for each project
    const numDays = Math.floor(Math.random() * 3) + 1;
    const selectedDayIndices = new Set<number>();

    while (selectedDayIndices.size < numDays) {
      selectedDayIndices.add(Math.floor(Math.random() * 7));
    }

    selectedDayIndices.forEach((dayIndex) => {
      const date = weekDates[dayIndex];
      // Duration between 1-8 hours in seconds (3600-28800)
      const duration = (Math.floor(Math.random() * 7) + 1) * 3600;

      entries.push({
        id: entries.length + 1,
        project_id: project.id,
        user_id: parseInt(userId) || 1,
        duration,
        date
      });

      // Update totals
      totalDuration += duration;
      byDay[date] = (byDay[date] || 0) + duration;
      byProject[project.id] = (byProject[project.id] || 0) + duration;
    });
  });

  return {
    entries,
    projects,
    user: {
      id: parseInt(userId) || 1,
      name: userId === "1" ? "Anna Smith" : "User " + userId
    },
    week: {
      number: weekNumber,
      year,
      start: startDate,
      end: endDate
    },
    totals: {
      duration: totalDuration,
      byDay,
      byProject
    }
  };
}

// Generate mock weekly all users report
function generateMockWeeklyAllUsersReport(weekNumber: number, year: number): WeeklyAllUsersReportResponse {
  const { weekDates, startDate, endDate } = getWeekDates(weekNumber, year);

  // Mock users
  const users = [
    { id: 1, name: "Anna Smith", role: "Administrator" },
    { id: 2, name: "John Doe", role: "Developer" },
    { id: 3, name: "Jane Wilson", role: "Designer" },
    { id: 4, name: "Robert Brown", role: "Manager" }
  ];

  // Mock projects
  const projects = [
    { id: 1, name: "Effertz, Ortiz and Cronin", color: "red" },
    { id: 2, name: "Voluptate et", color: "yellow" },
    { id: 3, name: "Suscipit dolor", color: "pink" },
    { id: 4, name: "Willms-Champlin", color: "blue" },
    { id: 5, name: "Quidem recusandae", color: "green" },
    { id: 6, name: "Rerum quos", color: "orange" }
  ];

  // Generate entries
  const entries: WeeklyReportEntry[] = [];
  const byDay: Record<string, number> = {};
  const byUser: Record<number, number> = {};
  let totalDuration = 0;

  users.forEach((user) => {
    // Each user works on 2-4 projects
    const numProjects = Math.floor(Math.random() * 3) + 2;
    let userDuration = 0;

    for (let i = 0; i < numProjects; i++) {
      const projectId = (i % projects.length) + 1;

      // Each project has entries on 1-3 days
      const numDays = Math.floor(Math.random() * 3) + 1;
      const selectedDayIndices = new Set<number>();

      while (selectedDayIndices.size < numDays) {
        selectedDayIndices.add(Math.floor(Math.random() * 7));
      }

      selectedDayIndices.forEach((dayIndex) => {
        const date = weekDates[dayIndex];
        // Duration between 1-8 hours in seconds (3600-28800)
        const duration = (Math.floor(Math.random() * 7) + 1) * 3600;

        entries.push({
          id: entries.length + 1,
          user_id: user.id,
          project_id: projectId,
          duration,
          date
        });

        // Update totals
        totalDuration += duration;
        userDuration += duration;
        byDay[date] = (byDay[date] || 0) + duration;
      });
    }

    byUser[user.id] = userDuration;
  });

  return {
    entries,
    users,
    projects,
    week: {
      number: weekNumber,
      year,
      start: startDate,
      end: endDate
    },
    totals: {
      duration: totalDuration,
      byDay,
      byUser
    }
  };
}

// Generate mock project overview report
function generateMockProjectOverviewReport(customerId?: number): ProjectOverviewResponse {
  // Mock customers
  const customers = [
    { id: 1, name: "Becker-Schultz" },
    { id: 2, name: "Willms Inc." },
    { id: 3, name: "Effertz Group" }
  ];
}