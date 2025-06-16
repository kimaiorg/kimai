import { getManagementAccessToken } from "@/api/auth.api";
import { reportAxios } from "@/api/axios";
import { getAllProjects } from "@/api/project.api";
import { Pagination } from "@/type_schema/common";
import { WeeklyAllUsersReportResponseType, WeeklyOneUserReportResponseType } from "@/type_schema/report";
import { formatDate } from "date-fns";

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
  return data;
}

export async function getProjectOverviewReport(customerId?: number): Promise<any> {
  try {
    const projectData = await getProjectOverviewReportData();
 
    if (customerId) {
      return {
        ...projectData,
        projects: projectData.projects.filter((project: any) => project.customer_id === customerId)
      };
    }

    return projectData;
  } catch (error) { 
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

async function getProjectOverviewReportData(): Promise<any> {
  const projectList = await getAllProjects(1, 200);

  const customerMap = new Map<number, any>();
  const projects: any[] = [];
  for (const projectItem of projectList.data) {
    const customer = {
      id: projectItem.customer.id,
      name: projectItem.customer.name,
      color: projectItem.customer.color
    };
    if (!customerMap.has(customer.id)) {
      customerMap.set(customer.id, customer);
    }
    const spentPercent = Math.random();
    const project = {
      id: projectItem.id,
      name: projectItem.name,
      color: projectItem.color,
      customer_id: customer.id,
      customer_name: customer.name,
      budget: projectItem.budget,
      spent: projectItem.budget * spentPercent,
      remaining: projectItem.budget - projectItem.budget * spentPercent,
      budget_used_percentage: spentPercent,
      not_billed: projectItem.budget * spentPercent * Math.random(),
      hourly_quota: Math.round(Math.random() * 5000),
      last_entry: formatDate(projectItem.start_date, "yyyy-MM-dd"),
      this_month: Math.round(Math.random() * 50 + 50),
      total: Math.round(Math.random() * 5000 + 250),
      not_exported: Math.round(Math.random() * 100)
    };
    projects.push(project);
  }
  return {
    customers: Array.from(customerMap.values()),
    projects
  };
}
