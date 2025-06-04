import { getManagementAccessToken } from "@/api/auth.api";
import { projectAxios, reportAxios } from "@/api/axios";
import { Pagination } from "@/type_schema/common";
import { CustomerReportData, ProjectOverviewResponse, ProjectReportData, WeeklyAllUsersReportResponse, WeeklyAllUsersReportResponseType, WeeklyOneUserReportResponseType, WeeklyReportEntry } from "@/type_schema/report";
import { TaskResponseType, TaskStatus } from "@/type_schema/task";

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

export async function getProjectOverviewReport(customerId?: number): Promise<any> {
  try {
    // For development/testing, use mock data
    // In production, this would call the actual API
    const mockData = await mockProjectOverviewReport();
    
    // Filter projects by customer if customerId is provided
    if (customerId) {
      return {
        ...mockData,
        projects: mockData.projects.filter((project: any) => project.customer_id === customerId)
      };
    }
    
    return mockData;
  } catch (error) {
    console.error("Error fetching project overview report:", error);
    throw error;
  }
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
export function loadProjectOverviewReportFromLocalStorage(customerId?: number, page: number = 1, pageSize: number = 10): ProjectOverviewResponse {
  const key = `project_overview_report${customerId ? `_${customerId}` : ""}_page${page}_size${pageSize}`;
  const storedData = localStorage.getItem(key);

  if (storedData) {
    return JSON.parse(storedData);
  }

  // Generate mock data if no data exists
  const mockData = generateMockProjectOverviewReport(customerId, page, pageSize);
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
function generateMockWeeklyUserReport(userId: string, weekNumber: number, year: number): WeeklyOneUserReportResponseType {
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
    entries: entries.reduce((acc, entry) => {
      // Find if we already have an entry for this task/project
      const existingTaskIndex = acc.findIndex(item => 
        item.task && item.task.id === entry.project_id
      );
      
      // Get the day index (0-6) from the date
      const entryDate = new Date(entry.date);
      const dayIndex = entryDate.getDay();
      
      if (existingTaskIndex >= 0) {
        // Update existing task entry
        const durations = [...acc[existingTaskIndex].duration];
        durations[dayIndex] = (durations[dayIndex] || 0) + entry.duration;
        
        acc[existingTaskIndex] = {
          ...acc[existingTaskIndex],
          duration: durations,
          totalDuration: acc[existingTaskIndex].totalDuration + entry.duration
        };
      } else {
        // Create new task entry
        const durations = Array(7).fill(0);
        durations[dayIndex] = entry.duration;
        
        // Find the corresponding project
        const project = projects.find(p => p.id === entry.project_id);
        
        acc.push({
          task: {
            id: entry.project_id, 
            title: project ? project.name : `Task ${entry.project_id || 'Unknown'}`,
            color: project ? project.color : '#cccccc',
            deadline: new Date().toISOString(),
            created_at: new Date().toISOString(),
            deleted_at: null,
            description: entry.description || '',
            updated_at: new Date().toISOString(),
            user_id: String(entry.user_id),
            status: TaskStatus.DOING,
            billable: true,
            expense_id: '0',
            quantity: 1,
            activity: {
              id: entry.activity_id || 0,
              name: 'Default Activity',
              color: '#cccccc',
              description: '',
              activity_number: 0,
              budget: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              deleted_at: null,
              project_id: entry.project_id,
              project: {} as any,
              team: {} as any,
              tasks: [] as any
            },
            expense: {
              id: 0,
              name: 'Default Expense',
              color: '#cccccc',
              description: '',
              project_id: entry.project_id,
              cost: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              deleted_at: null,
              project: {} as any,
              activity: {} as any,
              category: {} as any,
              task: {} as any
            }
          },
          duration: durations,
          totalDuration: entry.duration
        });
      }
      
      return acc;
    }, [] as { task: TaskResponseType; duration: any[]; totalDuration: any }[]),
    fromDate: startDate,
    toDate: endDate,
    user_id: userId
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
function generateMockProjectOverviewReport(customerId?: number, page: number = 1, pageSize: number = 10): ProjectOverviewResponse {
  // Mock customers based on SQL data
  const customers: CustomerReportData[] = [
    { id: 91, name: "Tech Solutions Inc.", address: "123 Innovation Way, Silicon Valley", contact: "contact@techsolutions.com" },
    { id: 92, name: "Global Retail Group", address: "456 Commerce Blvd, New York", contact: "info@globalretail.com" },
    { id: 93, name: "Healthcare Systems", address: "789 Medical Drive, Boston", contact: "support@healthcaresys.com" },
    { id: 94, name: "Financial Services Ltd.", address: "101 Banking Street, London", contact: "inquiries@finserv.com" },
    { id: 95, name: "Education Network", address: "202 Learning Lane, Cambridge", contact: "admin@edunetwork.org" },
    { id: 96, name: "Manufacturing Solutions", address: "303 Factory Road, Detroit", contact: "info@manusolutions.com" },
    { id: 97, name: "Logistics International", address: "404 Shipping Avenue, Rotterdam", contact: "operations@logisticsintl.com" },
    { id: 98, name: "Energy Innovations", address: "505 Power Street, Houston", contact: "support@energyinnovations.com" },
    { id: 99, name: "Media Productions", address: "606 Studio Boulevard, Los Angeles", contact: "info@mediaproductions.com" },
    { id: 68, name: "Hospitality Group", address: "707 Resort Drive, Miami", contact: "reservations@hospitalitygroup.com" },
    { id: 29, name: "Construction Partners", address: "808 Builder Way, Chicago", contact: "projects@constructionpartners.com" },
    { id: 64, name: "Telecom Services", address: "909 Network Road, Dallas", contact: "support@telecomservices.com" },
    { id: 8, name: "Agricultural Solutions", address: "111 Farm Lane, Iowa City", contact: "info@agsolutions.com" },
    { id: 49, name: "Pharmaceutical Research", address: "222 Lab Street, San Diego", contact: "research@pharmaco.com" },
    { id: 79, name: "Automotive Innovations", address: "333 Motor Avenue, Stuttgart", contact: "sales@autoinnovations.com" },
    { id: 33, name: "Real Estate Development", address: "444 Property Circle, Vancouver", contact: "info@realestatdev.com" },
    { id: 57, name: "Software Solutions", address: "555 Code Boulevard, Seattle", contact: "support@softwaresolutions.com" },
    { id: 17, name: "Fashion Enterprises", address: "666 Style Street, Milan", contact: "info@fashionenterprises.com" },
    { id: 72, name: "Food & Beverage Co.", address: "777 Culinary Avenue, Paris", contact: "orders@foodandbev.com" },
    { id: 26, name: "Travel Services", address: "888 Tourism Road, Barcelona", contact: "bookings@travelservices.com" }
  ];

  // Filter customers if customerId is provided
  const filteredCustomers = customerId
    ? customers.filter(c => c.id === customerId)
    : customers;

  // Apply pagination to customers
  const paginatedCustomers = filteredCustomers.slice((page - 1) * pageSize, page * pageSize);

  // Mock projects based on SQL data
  const projects: ProjectReportData[] = [
    {
      id: 8,
      customer_id: 96,
      customer_name: "Manufacturing Solutions",
      name: "Security Audit",
      hourly_quota: 120,
      budget: 50000,
      spent: 37500,
      time_spent: 85,
      last_entry: new Date().toISOString(),
      this_month: 25,
      total: 85,
      not_exported: 15,
      not_billed: 20,
      budget_used_percentage: 75,
      color: "#ff0066"
    },
    {
      id: 9,
      customer_id: 91,
      customer_name: "Tech Solutions Inc.",
      name: "Learning Management System",
      hourly_quota: 200,
      budget: 75000,
      spent: 30000,
      time_spent: 60,
      last_entry: new Date().toISOString(),
      this_month: 30,
      total: 60,
      not_exported: 10,
      not_billed: 15,
      budget_used_percentage: 40,
      color: "#66ff00"
    },
    {
      id: 10,
      customer_id: 92,
      customer_name: "Global Retail Group",
      name: "Cloud Migration",
      hourly_quota: 150,
      budget: 110000,
      spent: 82500,
      time_spent: 95,
      last_entry: new Date().toISOString(),
      this_month: 40,
      total: 95,
      not_exported: 20,
      not_billed: 25,
      budget_used_percentage: 75,
      color: "#0066ff"
    },
    {
      id: 11,
      customer_id: 94,
      customer_name: "Financial Services Ltd.",
      name: "AI Chatbot Implementation",
      hourly_quota: 180,
      budget: 65000,
      spent: 16250,
      time_spent: 45,
      last_entry: new Date().toISOString(),
      this_month: 15,
      total: 45,
      not_exported: 5,
      not_billed: 10,
      budget_used_percentage: 25,
      color: "#ff3300"
    },
    {
      id: 12,
      customer_id: 98,
      customer_name: "Energy Innovations",
      name: "Blockchain Integration",
      hourly_quota: 160,
      budget: 120000,
      spent: 60000,
      time_spent: 70,
      last_entry: new Date().toISOString(),
      this_month: 35,
      total: 70,
      not_exported: 12,
      not_billed: 18,
      budget_used_percentage: 50,
      color: "#33ff33"
    },
    {
      id: 13,
      customer_id: 93,
      customer_name: "Healthcare Systems",
      name: "Virtual Reality Tour",
      hourly_quota: 140,
      budget: 85000,
      spent: 63750,
      time_spent: 80,
      last_entry: new Date().toISOString(),
      this_month: 20,
      total: 80,
      not_exported: 18,
      not_billed: 22,
      budget_used_percentage: 75,
      color: "#9900cc"
    },
    {
      id: 14,
      customer_id: 97,
      customer_name: "Logistics International",
      name: "Supply Chain Optimization",
      hourly_quota: 190,
      budget: 95000,
      spent: 71250,
      time_spent: 90,
      last_entry: new Date().toISOString(),
      this_month: 45,
      total: 90,
      not_exported: 25,
      not_billed: 30,
      budget_used_percentage: 75,
      color: "#cc9900"
    },
    {
      id: 15,
      customer_id: 91,
      customer_name: "Tech Solutions Inc.",
      name: "Customer Portal Redesign",
      hourly_quota: 130,
      budget: 70000,
      spent: 35000,
      time_spent: 65,
      last_entry: new Date().toISOString(),
      this_month: 30,
      total: 65,
      not_exported: 15,
      not_billed: 20,
      budget_used_percentage: 50,
      color: "#00cccc"
    },
    {
      id: 16,
      customer_id: 96,
      customer_name: "Manufacturing Solutions",
      name: "Digital Marketing Campaign",
      hourly_quota: 110,
      budget: 55000,
      spent: 41250,
      time_spent: 75,
      last_entry: new Date().toISOString(),
      this_month: 25,
      total: 75,
      not_exported: 10,
      not_billed: 15,
      budget_used_percentage: 75,
      color: "#ff66cc"
    },
    {
      id: 17,
      customer_id: 92,
      customer_name: "Global Retail Group",
      name: "IoT Smart Office",
      hourly_quota: 200,
      budget: 125000,
      spent: 31250,
      time_spent: 40,
      last_entry: new Date().toISOString(),
      this_month: 20,
      total: 40,
      not_exported: 8,
      not_billed: 12,
      budget_used_percentage: 25,
      color: "#66ccff"
    },
    {
      id: 18,
      customer_id: 99,
      customer_name: "Media Productions",
      name: "Predictive Maintenance System",
      hourly_quota: 170,
      budget: 80000,
      spent: 60000,
      time_spent: 85,
      last_entry: new Date().toISOString(),
      this_month: 35,
      total: 85,
      not_exported: 20,
      not_billed: 25,
      budget_used_percentage: 75,
      color: "#ffcc66"
    },
    {
      id: 19,
      customer_id: 97,
      customer_name: "Logistics International",
      name: "Employee Training Platform",
      hourly_quota: 120,
      budget: 65000,
      spent: 48750,
      time_spent: 70,
      last_entry: new Date().toISOString(),
      this_month: 30,
      total: 70,
      not_exported: 15,
      not_billed: 20,
      budget_used_percentage: 75,
      color: "#cc66ff"
    },
    {
      id: 20,
      customer_id: 92,
      customer_name: "Global Retail Group",
      name: "Augmented Reality App",
      hourly_quota: 190,
      budget: 115000,
      spent: 86250,
      time_spent: 90,
      last_entry: new Date().toISOString(),
      this_month: 40,
      total: 90,
      not_exported: 22,
      not_billed: 28,
      budget_used_percentage: 75,
      color: "#33cc33"
    }
  ];

  // Filter projects if customerId is provided
  const filteredProjects = customerId
    ? projects.filter(p => p.customer_id === customerId)
    : projects;

  // Apply pagination to projects
  const paginatedProjects = filteredProjects.slice((page - 1) * pageSize, page * pageSize);

  return {
    projects: paginatedProjects,
    customers: paginatedCustomers
  };
}

/**
 * Generate mock data for Project Overview report
 * This function creates realistic mock data based on the database schema
 * @returns Mock project overview report data
 */
export function mockProjectOverviewReport(): Promise<any> {
  // Mock customers data based on kimai_project.sql
  const customers = [
    { id: 1, name: "John Doe", color: "#FF5733" },
    { id: 2, name: "Marrie Curiie", color: "#ff33be" },
    { id: 3, name: "Alan Hashley", color: "#4bff33" },
    { id: 4, name: "Alice Smith", color: "#33ffb5" },
    { id: 5, name: "Bob Johnson", color: "#ffb533" }
  ];

  // Mock projects data based on kimai_project.sql
  const projects = [
    {
      id: 1,
      name: "Website Redesign",
      color: "#33cc33",
      customer_id: 1,
      customer_name: "John Doe",
      budget: 50000,
      spent: 35000,
      remaining: 15000,
      budget_used_percentage: 0.7,
      not_billed: 5000,
      hourly_quota: 500,
      last_entry: "2025-06-03",
      this_month: 45,
      total: 350,
      not_exported: 20
    },
    {
      id: 2,
      name: "Mobile App Development",
      color: "#3366ff",
      customer_id: 1,
      customer_name: "John Doe",
      budget: 80000,
      spent: 40000,
      remaining: 40000,
      budget_used_percentage: 0.5,
      not_billed: 10000,
      hourly_quota: 800,
      last_entry: "2025-06-04",
      this_month: 60,
      total: 400,
      not_exported: 15
    },
    {
      id: 3,
      name: "E-commerce Platform",
      color: "#ff6633",
      customer_id: 2,
      customer_name: "Marrie Curiie",
      budget: 120000,
      spent: 110000,
      remaining: 10000,
      budget_used_percentage: 0.92,
      not_billed: 15000,
      hourly_quota: 1200,
      last_entry: "2025-06-02",
      this_month: 80,
      total: 950,
      not_exported: 30
    },
    {
      id: 4,
      name: "Security Audit",
      color: "#ff0066",
      customer_id: 3,
      customer_name: "Alan Hashley",
      budget: 50000,
      spent: 25000,
      remaining: 25000,
      budget_used_percentage: 0.5,
      not_billed: 5000,
      hourly_quota: 500,
      last_entry: "2025-06-01",
      this_month: 40,
      total: 250,
      not_exported: 10
    },
    {
      id: 5,
      name: "Cloud Migration",
      color: "#0066ff",
      customer_id: 4,
      customer_name: "Alice Smith",
      budget: 110000,
      spent: 115000,
      remaining: -5000,
      budget_used_percentage: 1.05,
      not_billed: 20000,
      hourly_quota: 1100,
      last_entry: "2025-06-04",
      this_month: 90,
      total: 1050,
      not_exported: 25
    },
    {
      id: 6,
      name: "AI Chatbot Implementation",
      color: "#ff3300",
      customer_id: 5,
      customer_name: "Bob Johnson",
      budget: 65000,
      spent: 40000,
      remaining: 25000,
      budget_used_percentage: 0.62,
      not_billed: 8000,
      hourly_quota: 650,
      last_entry: "2025-06-03",
      this_month: 55,
      total: 400,
      not_exported: 15
    },
    {
      id: 7,
      name: "Customer Portal Redesign",
      color: "#00cccc",
      customer_id: 2,
      customer_name: "Marrie Curiie",
      budget: 70000,
      spent: 30000,
      remaining: 40000,
      budget_used_percentage: 0.43,
      not_billed: 7000,
      hourly_quota: 700,
      last_entry: "2025-06-02",
      this_month: 35,
      total: 300,
      not_exported: 12
    }
  ];

  // Return mock data with a delay to simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        customers,
        projects
      });
    }, 500);
  });
}