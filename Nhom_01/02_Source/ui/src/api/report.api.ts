import { getManagementAccessToken } from "@/api/auth.api";
import { projectAxios } from "@/api/axios";
import { ReportService } from "@/db/reportService";
import { Pagination } from "@/type_schema/common";
import {
  ProjectOverviewResponse,
  WeeklyAllUsersReportResponseType,
  WeeklyOneUserReportResponseType
} from "@/type_schema/report";
import { TaskStatus } from "@/type_schema/task";
import axios from "axios";

const TIMESHEET_BACKEND_URL = process.env.TIMESHEET_BACKEND_URL;

export async function getWeeklyOneUserReport(
  userId: string,
  fromDate: string,
  toDate: string
): Promise<WeeklyOneUserReportResponseType> {
  const token = await getManagementAccessToken();
  console.log(token);
  const params = new URLSearchParams();
  params.append("userId", userId);
  params.append("fromDate", fromDate);
  params.append("toDate", toDate);

  return fakeWeeklyOneUserReport();

  const response = await axios.get<WeeklyOneUserReportResponseType>(
    `${TIMESHEET_BACKEND_URL}/api/v1/reports/one-user?${params.toString()}`,
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

export async function getWeeklyAllUsersReport(
  fromDate: string,
  toDate: string
): Promise<Pagination<WeeklyAllUsersReportResponseType>> {
  const token = await getManagementAccessToken();
  console.log(token);
  const params = new URLSearchParams();
  params.append("fromDate", fromDate);
  params.append("toDate", toDate);

  return {
    metadata: {
      total: 4,
      page: 1,
      limit: 10,
      totalPages: 1
    },
    data: fakeWeeklyAllUsersReport()
  };

  const response = await axios.get<Pagination<WeeklyAllUsersReportResponseType>>(
    `${TIMESHEET_BACKEND_URL}/api/v1/reports/all-users?${params.toString()}`,
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

const fakeWeeklyOneUserReport = (): WeeklyOneUserReportResponseType => {
  return {
    user_id: "1",
    fromDate: "2025-05-01T15:39:11.346Z",
    toDate: "2025-05-07T15:39:11.346Z",
    entries: [
      {
        task: {
          id: 1,
          title: "Task 1 Fix bug",
          color: "red",
          deadline: "2023-05-01T15:39:11.346Z",
          created_at: "2023-05-01T15:39:11.346Z",
          deleted_at: null,
          description: "",
          updated_at: "",
          activity: {
            id: 0,
            name: "",
            color: "",
            description: "",
            activity_number: 0,
            budget: 0,
            project_id: 0,
            created_at: "",
            updated_at: "",
            deleted_at: null,
            project: {
              id: 0,
              name: "",
              color: "",
              project_number: 0,
              order_number: 0,
              order_date: "",
              start_date: "",
              end_date: "",
              budget: 0,
              customer_id: 0,
              created_at: "",
              updated_at: "",
              deleted_at: null
            },
            team: {
              id: 0,
              name: "",
              color: "",
              created_at: "",
              updated_at: "",
              deleted_at: null,
              lead: "",
              users: []
            },
            tasks: [],
            quota: undefined
          },
          expense: {
            id: 0,
            name: "",
            color: "",
            description: "",
            project_id: 0,
            project: {
              id: 0,
              name: "",
              color: "",
              project_number: 0,
              order_number: 0,
              order_date: "",
              start_date: "",
              end_date: "",
              budget: 0,
              created_at: "",
              updated_at: "",
              deleted_at: null,
              teams: [],
              customer: {
                id: 0,
                name: "",
                color: "",
                description: "",
                address: "",
                company_name: "",
                account_number: "",
                vat_id: "",
                country: "",
                currency: "",
                timezone: "",
                email: "",
                phone: "",
                homepage: "",
                created_at: "",
                updated_at: "",
                deleted_at: null,
                projects: []
              }
            },
            activity: {
              id: 0,
              name: "",
              color: "",
              description: "",
              activity_number: 0,
              budget: 0,
              project_id: 0,
              created_at: "",
              updated_at: "",
              deleted_at: null,
              project: {
                id: 0,
                name: "",
                color: "",
                project_number: 0,
                order_number: 0,
                order_date: "",
                start_date: "",
                end_date: "",
                budget: 0,
                customer_id: 0,
                created_at: "",
                updated_at: "",
                deleted_at: null
              },
              team: {
                id: 0,
                name: "",
                color: "",
                created_at: "",
                updated_at: "",
                deleted_at: null,
                lead: "",
                users: []
              },
              tasks: [],
              quota: undefined
            },
            category: {
              id: 0,
              name: "",
              color: "",
              description: "",
              created_at: "",
              updated_at: "",
              deleted_at: null
            },
            cost: 0,
            created_at: "",
            updated_at: "",
            deleted_at: null,
            task: []
          },
          expense_id: "",
          quantity: 0,
          user_id: "",
          status: TaskStatus.PROCESSING,
          billable: false
        },
        duration: ["8:00", "8:00", "8:00", "", "8:10", "", ""],
        totalDuration: "32:10"
      },
      {
        task: {
          id: 2,
          title: "Task 2 research",
          color: "red",
          deadline: "2023-05-01T15:39:11.346Z",
          created_at: "2023-05-01T15:39:11.346Z",
          deleted_at: null,
          description: "",
          updated_at: "",
          activity: {
            id: 0,
            name: "",
            color: "",
            description: "",
            activity_number: 0,
            budget: 0,
            project_id: 0,
            created_at: "",
            updated_at: "",
            deleted_at: null,
            project: {
              id: 0,
              name: "",
              color: "",
              project_number: 0,
              order_number: 0,
              order_date: "",
              start_date: "",
              end_date: "",
              budget: 0,
              customer_id: 0,
              created_at: "",
              updated_at: "",
              deleted_at: null
            },
            team: {
              id: 0,
              name: "",
              color: "",
              created_at: "",
              updated_at: "",
              deleted_at: null,
              lead: "",
              users: []
            },
            tasks: [],
            quota: undefined
          },
          expense: {
            id: 0,
            name: "",
            color: "",
            description: "",
            project_id: 0,
            project: {
              id: 0,
              name: "",
              color: "",
              project_number: 0,
              order_number: 0,
              order_date: "",
              start_date: "",
              end_date: "",
              budget: 0,
              created_at: "",
              updated_at: "",
              deleted_at: null,
              teams: [],
              customer: {
                id: 0,
                name: "",
                color: "",
                description: "",
                address: "",
                company_name: "",
                account_number: "",
                vat_id: "",
                country: "",
                currency: "",
                timezone: "",
                email: "",
                phone: "",
                homepage: "",
                created_at: "",
                updated_at: "",
                deleted_at: null,
                projects: []
              }
            },
            activity: {
              id: 0,
              name: "",
              color: "",
              description: "",
              activity_number: 0,
              budget: 0,
              project_id: 0,
              created_at: "",
              updated_at: "",
              deleted_at: null,
              project: {
                id: 0,
                name: "",
                color: "",
                project_number: 0,
                order_number: 0,
                order_date: "",
                start_date: "",
                end_date: "",
                budget: 0,
                customer_id: 0,
                created_at: "",
                updated_at: "",
                deleted_at: null
              },
              team: {
                id: 0,
                name: "",
                color: "",
                created_at: "",
                updated_at: "",
                deleted_at: null,
                lead: "",
                users: []
              },
              tasks: [],
              quota: undefined
            },
            category: {
              id: 0,
              name: "",
              color: "",
              description: "",
              created_at: "",
              updated_at: "",
              deleted_at: null
            },
            cost: 0,
            created_at: "",
            updated_at: "",
            deleted_at: null,
            task: []
          },
          expense_id: "",
          quantity: 0,
          user_id: "",
          status: TaskStatus.PROCESSING,
          billable: false
        },
        duration: ["", "", "7:00", "5:00", "6:00", "", ""],
        totalDuration: "18:00"
      }
    ]
  };
};

const fakeWeeklyAllUsersReport = (): WeeklyAllUsersReportResponseType[] => {
  return [
    {
      fromDate: "2025-05-01T15:39:11.346Z",
      toDate: "2025-05-07T15:39:11.346Z",
      entries: [
        {
          user_id: "1",
          task: {
            id: 1,
            title: "Task 1 Fix bug",
            color: "red",
            deadline: "2023-05-01T15:39:11.346Z",
            created_at: "2023-05-01T15:39:11.346Z",
            deleted_at: null,
            description: "",
            updated_at: "",
            activity: {
              id: 0,
              name: "",
              color: "",
              description: "",
              activity_number: 0,
              budget: 0,
              project_id: 0,
              created_at: "",
              updated_at: "",
              deleted_at: null,
              project: {
                id: 0,
                name: "",
                color: "",
                project_number: 0,
                order_number: 0,
                order_date: "",
                start_date: "",
                end_date: "",
                budget: 0,
                customer_id: 0,
                created_at: "",
                updated_at: "",
                deleted_at: null
              },
              team: {
                id: 0,
                name: "",
                color: "",
                created_at: "",
                updated_at: "",
                deleted_at: null,
                lead: "",
                users: []
              },
              tasks: [],
              quota: undefined
            },
            expense: {
              id: 0,
              name: "",
              color: "",
              description: "",
              project_id: 0,
              project: {
                id: 0,
                name: "",
                color: "",
                project_number: 0,
                order_number: 0,
                order_date: "",
                start_date: "",
                end_date: "",
                budget: 0,
                created_at: "",
                updated_at: "",
                deleted_at: null,
                teams: [],
                customer: {
                  id: 0,
                  name: "",
                  color: "",
                  description: "",
                  address: "",
                  company_name: "",
                  account_number: "",
                  vat_id: "",
                  country: "",
                  currency: "",
                  timezone: "",
                  email: "",
                  phone: "",
                  homepage: "",
                  created_at: "",
                  updated_at: "",
                  deleted_at: null,
                  projects: []
                }
              },
              activity: {
                id: 0,
                name: "",
                color: "",
                description: "",
                activity_number: 0,
                budget: 0,
                project_id: 0,
                created_at: "",
                updated_at: "",
                deleted_at: null,
                project: {
                  id: 0,
                  name: "",
                  color: "",
                  project_number: 0,
                  order_number: 0,
                  order_date: "",
                  start_date: "",
                  end_date: "",
                  budget: 0,
                  customer_id: 0,
                  created_at: "",
                  updated_at: "",
                  deleted_at: null
                },
                team: {
                  id: 0,
                  name: "",
                  color: "",
                  created_at: "",
                  updated_at: "",
                  deleted_at: null,
                  lead: "",
                  users: []
                },
                tasks: [],
                quota: undefined
              },
              category: {
                id: 0,
                name: "",
                color: "",
                description: "",
                created_at: "",
                updated_at: "",
                deleted_at: null
              },
              cost: 0,
              created_at: "",
              updated_at: "",
              deleted_at: null,
              task: []
            },
            expense_id: "",
            quantity: 0,
            user_id: "",
            status: TaskStatus.PROCESSING,
            billable: false
          },
          duration: ["8:00", "8:00", "8:00", "", "8:10", "", ""],
          totalDuration: "32:10"
        },
        {
          user_id: "2",
          task: {
            id: 2,
            title: "Task 2 research",
            color: "red",
            deadline: "2023-05-01T15:39:11.346Z",
            created_at: "2023-05-01T15:39:11.346Z",
            deleted_at: null,
            description: "",
            updated_at: "",
            activity: {
              id: 0,
              name: "",
              color: "",
              description: "",
              activity_number: 0,
              budget: 0,
              project_id: 0,
              created_at: "",
              updated_at: "",
              deleted_at: null,
              project: {
                id: 0,
                name: "",
                color: "",
                project_number: 0,
                order_number: 0,
                order_date: "",
                start_date: "",
                end_date: "",
                budget: 0,
                customer_id: 0,
                created_at: "",
                updated_at: "",
                deleted_at: null
              },
              team: {
                id: 0,
                name: "",
                color: "",
                created_at: "",
                updated_at: "",
                deleted_at: null,
                lead: "",
                users: []
              },
              tasks: [],
              quota: undefined
            },
            expense: {
              id: 0,
              name: "",
              color: "",
              description: "",
              project_id: 0,
              project: {
                id: 0,
                name: "",
                color: "",
                project_number: 0,
                order_number: 0,
                order_date: "",
                start_date: "",
                end_date: "",
                budget: 0,
                created_at: "",
                updated_at: "",
                deleted_at: null,
                teams: [],
                customer: {
                  id: 0,
                  name: "",
                  color: "",
                  description: "",
                  address: "",
                  company_name: "",
                  account_number: "",
                  vat_id: "",
                  country: "",
                  currency: "",
                  timezone: "",
                  email: "",
                  phone: "",
                  homepage: "",
                  created_at: "",
                  updated_at: "",
                  deleted_at: null,
                  projects: []
                }
              },
              activity: {
                id: 0,
                name: "",
                color: "",
                description: "",
                activity_number: 0,
                budget: 0,
                project_id: 0,
                created_at: "",
                updated_at: "",
                deleted_at: null,
                project: {
                  id: 0,
                  name: "",
                  color: "",
                  project_number: 0,
                  order_number: 0,
                  order_date: "",
                  start_date: "",
                  end_date: "",
                  budget: 0,
                  customer_id: 0,
                  created_at: "",
                  updated_at: "",
                  deleted_at: null
                },
                team: {
                  id: 0,
                  name: "",
                  color: "",
                  created_at: "",
                  updated_at: "",
                  deleted_at: null,
                  lead: "",
                  users: []
                },
                tasks: [],
                quota: undefined
              },
              category: {
                id: 0,
                name: "",
                color: "",
                description: "",
                created_at: "",
                updated_at: "",
                deleted_at: null
              },
              cost: 0,
              created_at: "",
              updated_at: "",
              deleted_at: null,
              task: []
            },
            expense_id: "",
            quantity: 0,
            user_id: "",
            status: TaskStatus.PROCESSING,
            billable: false
          },
          duration: ["", "", "7:00", "5:00", "6:00", "", ""],
          totalDuration: "18:00"
        }
      ]
    }
  ];
};
