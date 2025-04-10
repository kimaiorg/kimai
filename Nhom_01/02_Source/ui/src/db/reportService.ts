import {
  WeeklyUserReportResponse,
  WeeklyAllUsersReportResponse,
  ProjectOverviewResponse,
  WeeklyReportEntry
} from "@/type_schema/report";

// Function to load weekly user report data from localStorage
export function loadWeeklyUserReportFromLocalStorage(
  userId: string,
  weekNumber: number,
  year: number
): WeeklyUserReportResponse {
  const key = `weekly_user_report_${userId}_${weekNumber}_${year}`;
  const storedData = localStorage.getItem(key);

  if (storedData) {
    return JSON.parse(storedData);
  }

  // Generate mock data if no data exists
  const mockData = generateMockWeeklyUserReport(userId, weekNumber, year);
  localStorage.setItem(key, JSON.stringify(mockData));
  return mockData;
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

  // Generate projects with realistic data
  const allProjects = [
    {
      id: 1,
      customer_id: 1,
      customer_name: "Becker-Schultz",
      name: "Adipisci aut",
      hourly_quota: 177.55,
      budget: 43090.97,
      spent: 0.75 * 43090.97,
      time_spent: 554.28,
      last_entry: new Date().toISOString().split("T")[0],
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
      last_entry: new Date().toISOString().split("T")[0],
      this_month: 0.12,
      total: 0.12,
      not_exported: 0.12,
      not_billed: 0,
      budget_used_percentage: 1.0,
      color: "pink"
    },
    {
      id: 3,
      customer_id: 2,
      customer_name: "Willms Inc.",
      name: "Est sequi",
      hourly_quota: 888.53,
      budget: 52252.08,
      spent: 1.25 * 52252.08,
      time_spent: 888.53,
      last_entry: new Date().toISOString().split("T")[0],
      this_month: 0.14,
      total: 0.14,
      not_exported: 0.14,
      not_billed: 0,
      budget_used_percentage: 1.25,
      color: "yellow"
    },
    {
      id: 4,
      customer_id: 2,
      customer_name: "Willms Inc.",
      name: "Est voluptatem",
      hourly_quota: 1218.08,
      budget: 77692.83,
      spent: 1.8 * 77692.83,
      time_spent: 1218.08,
      last_entry: new Date().toISOString().split("T")[0],
      this_month: 0.2,
      total: 0.2,
      not_exported: 0.2,
      not_billed: 0,
      budget_used_percentage: 1.8,
      color: "blue"
    },
    {
      id: 5,
      customer_id: 3,
      customer_name: "Effertz Group",
      name: "Extreme Overbudget",
      hourly_quota: 500.0,
      budget: 25000.0,
      spent: 3.0 * 25000.0,
      time_spent: 1500.0,
      last_entry: new Date().toISOString().split("T")[0],
      this_month: 0.3,
      total: 0.3,
      not_exported: 0.3,
      not_billed: 0,
      budget_used_percentage: 3.0,
      color: "red"
    }
  ];

  // Filter projects by customer ID if provided
  const projects = customerId ? allProjects.filter((project) => project.customer_id === customerId) : allProjects;

  return {
    projects,
    customers
  };
}

// Report service class to handle all report operations
export class ReportService {
  // Get weekly report data for a specific user
  static getWeeklyUserReport(userId: string, weekNumber: number, year: number): WeeklyUserReportResponse {
    try {
      return loadWeeklyUserReportFromLocalStorage(userId, weekNumber, year);
    } catch (error) {
      console.error("Error loading weekly user report:", error);
      // Return fallback data in case of error
      return generateMockWeeklyUserReport(userId, weekNumber, year);
    }
  }

  // Get weekly report data for all users
  static getWeeklyAllUsersReport(weekNumber: number, year: number): WeeklyAllUsersReportResponse {
    try {
      return loadWeeklyAllUsersReportFromLocalStorage(weekNumber, year);
    } catch (error) {
      console.error("Error loading weekly all users report:", error);
      // Return fallback data in case of error
      return generateMockWeeklyAllUsersReport(weekNumber, year);
    }
  }

  // Get project overview report data
  static getProjectOverviewReport(customerId?: number): ProjectOverviewResponse {
    try {
      return loadProjectOverviewReportFromLocalStorage(customerId);
    } catch (error) {
      console.error("Error loading project overview report:", error);
      // Return fallback data in case of error
      return generateMockProjectOverviewReport(customerId);
    }
  }

  // Initialize the database with mock data (if needed)
  static initializeDatabase(): void {
    // This will be called when the app starts to ensure we have data
    try {
      // Only run in browser environment
      if (typeof window !== "undefined") {
        // Check if we already have some data
        const hasWeeklyUserData = localStorage.getItem("weekly_user_report_1_15_2025");
        const hasWeeklyAllData = localStorage.getItem("weekly_all_users_report_15_2025");
        const hasProjectData = localStorage.getItem("project_overview_report");

        // Initialize with current week if no data exists
        const now = new Date();
        const currentYear = now.getFullYear();
        const firstDayOfYear = new Date(currentYear, 0, 1);
        const daysPassed = Math.floor((now.getTime() - firstDayOfYear.getTime()) / 86400000);
        const currentWeek = Math.ceil((daysPassed + 1) / 7);

        if (!hasWeeklyUserData) {
          const mockData = generateMockWeeklyUserReport("1", currentWeek, currentYear);
          localStorage.setItem(`weekly_user_report_1_${currentWeek}_${currentYear}`, JSON.stringify(mockData));
        }

        if (!hasWeeklyAllData) {
          const mockData = generateMockWeeklyAllUsersReport(currentWeek, currentYear);
          localStorage.setItem(`weekly_all_users_report_${currentWeek}_${currentYear}`, JSON.stringify(mockData));
        }

        if (!hasProjectData) {
          const mockData = generateMockProjectOverviewReport();
          localStorage.setItem("project_overview_report", JSON.stringify(mockData));
        }
      }
    } catch (error) {
      console.error("Error initializing report database:", error);
    }
  }
}
