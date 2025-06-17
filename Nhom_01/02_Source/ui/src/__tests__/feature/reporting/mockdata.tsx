import { ProjectOverviewReport } from "@/app/(pages)/reporting/project-overview";
import { WeeklyUserReport } from "@/app/(pages)/reporting/weekly-user";
import { ReportView, ReportViewType } from "@/type_schema/report";
import { Role } from "@/type_schema/role";
import { FolderIcon, UserIcon } from "lucide-react";

export const mockApiToken =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IndxR0FpUTBzWTJnRUdjcXBpeWQ5TiJ9.eyJpc3MiOiJodHRwczovL2Rldi1yMGJ0ZDVlb3pnYzdvZmtqLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw2N2Q5OTFiODBmNzkxNmQ5NDJlMjVkMWQiLCJhdWQiOlsia2ltYWlfYXBpIiwiaHR0cHM6Ly9kZXYtcjBidGQ1ZW96Z2M3b2Zrai51cy5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNzQ4Nzg4MzAzLCJleHAiOjE3NDg4NzQ3MDMsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJhenAiOiJ4Qlo3am5sY0hxbGtzeVh4VERkZzRFRFN0eXljMlE5NiIsInBlcm1pc3Npb25zIjpbImFwcHJvdmU6cmVxdWVzdHMiLCJjcmVhdGU6YWN0aXZpdGllcyIsImNyZWF0ZTpjYXRlZ29yaWVzIiwiY3JlYXRlOmN1c3RvbWVycyIsImNyZWF0ZTpleHBlbnNlcyIsImNyZWF0ZTpwcm9qZWN0cyIsImNyZWF0ZTp0YXNrcyIsImNyZWF0ZTp0ZWFtcyIsInJlYWQ6YWN0aXZpdGllcyIsInJlYWQ6Y2F0ZWdvcmllcyIsInJlYWQ6Y3VzdG9tZXJzIiwicmVhZDpleHBlbnNlcyIsInJlYWQ6cHJvamVjdHMiLCJyZWFkOnJlcXVlc3QiLCJyZWFkOnRhc2tzIiwicmVhZDp0ZWFtcyIsInJlYWQ6dGltZXNoZWV0cyIsInVwZGF0ZTphY3Rpdml0aWVzIiwidXBkYXRlOmNhdGVnb3JpZXMiLCJ1cGRhdGU6Y3VzdG9tZXJzIiwidXBkYXRlOmV4cGVuc2VzIiwidXBkYXRlOnByb2plY3RzIiwidXBkYXRlOnRhc2tzIiwidXBkYXRlOnRlYW1zIiwidXBkYXRlOnRpbWVzaGVldHMiXX0.HY8EudYREbIp-LjMroh2zL-0O5zOEMplXQ53D68ouotQDQVwRIMWY-1Pu086dE1ZkANw1pYj3OJaVSTIh-yXyfxAT599OrB1hg1ApT8fXRJATtQaKtcwD1Zq99BcYd0DwbPSCju6hrQHcj-jT5HeYtIWtGoJVq88Gut_9MGmFiCtqySG6tiIIiMK61iXUmtQsmCsp-mINfB60iqUhFa39GCsmi5ZOUbro9_yAMQ6bMkp-mPXMq-H_NzrmrLlgy66uCBV1mxYad3quRqt3nJvjrObvsqyegGkpNploqy3K9a9IkSwpUeZLfe_WfY22GxUfiWM19lAgEhGiTDQ772KsQ";

export const mockUserObj = {
  nickname: "superadmin",
  name: "Superadmin",
  picture:
    "https://s.gravatar.com/avatar/6e088c3cf35987ad4e3dfc90e7b8dec6?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fsu.png",
  updated_at: "2025-05-31T14:27:45.928Z",
  email: "superadmin@gmail.com",
  email_verified: false,
  sub: "auth0|67d991b80f7916d942e25d1d",
  sid: "3t84NCaDSnsyMuODl1oXs2wJODe2TWtR"
};

export const mockUserStateObj = {
  user: null,
  privilege: {
    role: {
      id: "rol_pXo5uURLgqPVUliv",
      name: "Superadmin",
      description: "Super Admin role"
    },
    permissions: [
      {
        permission_name: "approve:requests",
        description: "Approve requests",
        resource_server_name: "Kimai API",
        resource_server_identifier: "kimai_api"
      },
      {
        permission_name: "create:activities",
        description: "Create activities",
        resource_server_name: "Kimai API",
        resource_server_identifier: "kimai_api"
      },
      {
        permission_name: "create:categories",
        description: "Create categories",
        resource_server_name: "Kimai API",
        resource_server_identifier: "kimai_api"
      },
      {
        permission_name: "create:customers",
        description: "Create customer",
        resource_server_name: "Kimai API",
        resource_server_identifier: "kimai_api"
      },
      {
        permission_name: "create:expenses",
        description: "Create expenses",
        resource_server_name: "Kimai API",
        resource_server_identifier: "kimai_api"
      },
      {
        permission_name: "create:projects",
        description: "Create projects",
        resource_server_name: "Kimai API",
        resource_server_identifier: "kimai_api"
      },
      {
        permission_name: "create:tasks",
        description: "Create tasks",
        resource_server_name: "Kimai API",
        resource_server_identifier: "kimai_api"
      },
      {
        permission_name: "create:teams",
        description: "Create teams",
        resource_server_name: "Kimai API",
        resource_server_identifier: "kimai_api"
      },
      {
        permission_name: "read:activities",
        description: "Read activities",
        resource_server_name: "Kimai API",
        resource_server_identifier: "kimai_api"
      },
      {
        permission_name: "read:categories",
        description: "Read categories",
        resource_server_name: "Kimai API",
        resource_server_identifier: "kimai_api"
      },
      {
        permission_name: "read:customers",
        description: "Read customers",
        resource_server_name: "Kimai API",
        resource_server_identifier: "kimai_api"
      },
      {
        permission_name: "read:expenses",
        description: "Read expense",
        resource_server_name: "Kimai API",
        resource_server_identifier: "kimai_api"
      },
      {
        permission_name: "read:projects",
        description: "Read projects",
        resource_server_name: "Kimai API",
        resource_server_identifier: "kimai_api"
      },
      {
        permission_name: "read:request",
        description: "Review requests",
        resource_server_name: "Kimai API",
        resource_server_identifier: "kimai_api"
      },
      {
        permission_name: "read:tasks",
        description: "Read tasks",
        resource_server_name: "Kimai API",
        resource_server_identifier: "kimai_api"
      },
      {
        permission_name: "read:teams",
        description: "Read teams",
        resource_server_name: "Kimai API",
        resource_server_identifier: "kimai_api"
      },
      {
        permission_name: "read:timesheets",
        description: "Read timesheets",
        resource_server_name: "Kimai API",
        resource_server_identifier: "kimai_api"
      },
      {
        permission_name: "update:activities",
        description: "Update activities",
        resource_server_name: "Kimai API",
        resource_server_identifier: "kimai_api"
      },
      {
        permission_name: "update:categories",
        description: "Update categories",
        resource_server_name: "Kimai API",
        resource_server_identifier: "kimai_api"
      },
      {
        permission_name: "update:customers",
        description: "Update customers",
        resource_server_name: "Kimai API",
        resource_server_identifier: "kimai_api"
      },
      {
        permission_name: "update:expenses",
        description: "Update expenses",
        resource_server_name: "Kimai API",
        resource_server_identifier: "kimai_api"
      },
      {
        permission_name: "update:projects",
        description: "Update projects",
        resource_server_name: "Kimai API",
        resource_server_identifier: "kimai_api"
      },
      {
        permission_name: "update:tasks",
        description: "Update tasks",
        resource_server_name: "Kimai API",
        resource_server_identifier: "kimai_api"
      },
      {
        permission_name: "update:teams",
        description: "Update teams",
        resource_server_name: "Kimai API",
        resource_server_identifier: "kimai_api"
      },
      {
        permission_name: "update:timesheets",
        description: "Update timesheets",
        resource_server_name: "Kimai API",
        resource_server_identifier: "kimai_api"
      }
    ]
  }
};

export const mockWeekUserReportData = {
  user_id: "auth0|67d991b80f7916d942e25d1d",
  fromDate: "2025-06-01T17:00:00.000Z",
  toDate: "2025-06-07T17:00:00.000Z",
  entries: [
    {
      task: {
        id: 67,
        title: "Develop batch APPROVED system",
        deadline: "2025-04-01T00:00:00.000Z",
        description: "Create background job APPROVED",
        user_id: "auth0|67e177daa644c618cb3eb35e",
        color: "#ff5733",
        status: "DONE",
        billable: true,
        is_paid: false,
        request_status: "APPROVED",
        activity_id: 159,
        expense_id: 53,
        quantity: 8,
        created_at: "2025-05-30T15:00:00.000Z",
        updated_at: "2025-05-30T15:00:00.000Z",
        deleted_at: null,
        activity: {
          id: 159,
          name: "Serverless Computing Migration",
          color: "#1abc9c",
          description: "Migrate applications to serverless architecture",
          activity_number: 266,
          budget: 3200,
          project_id: 123,
          team_id: 9,
          created_at: "2025-05-17T14:00:00.000Z",
          updated_at: "2025-05-17T14:00:00.000Z",
          deleted_at: null
        },
        expense: {
          id: 53,
          name: "Text editor licenses",
          description: "Code editor subscriptions",
          color: "#cc3399",
          project_id: 53,
          activity_id: 53,
          category_id: 53,
          cost: 78,
          created_at: "2025-03-15T13:25:00.000Z",
          updated_at: "2025-05-18T09:40:00.000Z",
          deleted_at: null
        }
      },
      duration: ["0:00", "9:30", "9:30", "2:30", "5:30", "5:30", ""],
      totalDuration: "16:00"
    },
    {
      task: {
        id: 78,
        title: "Develop machine learning pipeline",
        deadline: "2025-05-25T00:00:00.000Z",
        description: "Create ML data APPROVED workflow",
        user_id: "auth0|67e441428781d3f24243d71a",
        color: "#33ff41",
        status: "DONE",
        billable: true,
        is_paid: false,
        request_status: "APPROVED",
        activity_id: 153,
        expense_id: 72,
        quantity: 11,
        created_at: "2025-05-01T16:00:00.000Z",
        updated_at: "2025-05-01T16:00:00.000Z",
        deleted_at: null,
        activity: {
          id: 153,
          name: "Augmented Reality Shopping",
          color: "#2980b9",
          description: "Develop AR shopping experience",
          activity_number: 260,
          budget: 4100,
          project_id: 127,
          team_id: 5,
          created_at: "2025-05-16T17:00:00.000Z",
          updated_at: "2025-05-16T17:00:00.000Z",
          deleted_at: null
        },
        expense: {
          id: 72,
          name: "Frontend testing tools",
          description: "UI testing automation",
          color: "#3366cc",
          project_id: 72,
          activity_id: 72,
          category_id: 72,
          cost: 87,
          created_at: "2024-01-22T14:10:00.000Z",
          updated_at: "2025-01-28T09:25:00.000Z",
          deleted_at: null
        }
      },
      duration: ["3:00", "5:00", "8:00", "2:45", "4:45", "0:45", ""],
      totalDuration: "8:00"
    },
    {
      task: {
        id: 89,
        title: "Create predictive analytics system",
        deadline: "2025-05-20T00:00:00.000Z",
        description: "Implement forecasting algorithms",
        user_id: "auth0|6803dffac3438da2f9a1d856",
        color: "#33b1ff",
        status: "DOING",
        billable: true,
        is_paid: false,
        request_status: "APPROVED",
        activity_id: 157,
        expense_id: 86,
        quantity: 10,
        created_at: "2025-05-02T17:00:00.000Z",
        updated_at: "2025-05-02T17:00:00.000Z",
        deleted_at: null,
        activity: {
          id: 157,
          name: "Internationalization Framework",
          color: "#c0392b",
          description: "Implement i18n framework for applications",
          activity_number: 264,
          budget: 1400,
          project_id: 122,
          team_id: 2,
          created_at: "2025-05-17T12:00:00.000Z",
          updated_at: "2025-05-17T12:00:00.000Z",
          deleted_at: null
        },
        expense: {
          id: 86,
          name: "Recommendation engine",
          description: "Personalization system",
          color: "#6699cc",
          project_id: 86,
          activity_id: 86,
          category_id: 76,
          cost: 44,
          created_at: "2024-04-25T13:30:00.000Z",
          updated_at: "2025-02-28T09:45:00.000Z",
          deleted_at: null
        }
      },
      duration: ["8:15", "8:15", "8:00", "6:30", "2:00", "2:30", ""],
      totalDuration: "8:00"
    },
    {
      task: {
        id: 112,
        title: "Create content management system",
        deadline: "2025-01-15T00:00:00.000Z",
        description: "Implement flexible CMS platform",
        user_id: "auth0|67e17804a2a92ff53f9911c1",
        color: "#9933ff",
        status: "DONE",
        billable: true,
        is_paid: false,
        request_status: "APPROVED",
        activity_id: 150,
        expense_id: 23,
        quantity: 8,
        created_at: "2025-05-05T10:00:00.000Z",
        updated_at: "2025-05-05T10:00:00.000Z",
        deleted_at: null,
        activity: {
          id: 150,
          name: "Product Information Management",
          color: "#34495e",
          description: "Develop product information management system",
          activity_number: 257,
          budget: 3500,
          project_id: 127,
          team_id: 14,
          created_at: "2025-05-16T14:00:00.000Z",
          updated_at: "2025-05-16T14:00:00.000Z",
          deleted_at: null
        },
        expense: {
          id: 23,
          name: "Backup solutions",
          description: "Data backup services",
          color: "#669999",
          project_id: 23,
          activity_id: 23,
          category_id: 23,
          cost: 290,
          created_at: "2025-02-20T16:40:00.000Z",
          updated_at: "2025-04-25T13:15:00.000Z",
          deleted_at: null
        }
      },
      duration: ["4:30", "5:30", "3:45", "9:15", "2:30", "10:00", ""],
      totalDuration: "2:00"
    },
    {
      task: {
        id: 120,
        title: "Develop virtual reality experience",
        deadline: "2025-04-25T00:00:00.000Z",
        description: "Create immersive VR application",
        user_id: "auth0|67d991b80f7916d942e25d1d",
        color: "#c2f485",
        status: "DONE",
        billable: true,
        is_paid: false,
        request_status: "APPROVED",
        activity_id: 158,
        expense_id: 31,
        quantity: 12,
        created_at: "2025-05-05T18:00:00.000Z",
        updated_at: "2025-05-05T18:00:00.000Z",
        deleted_at: null,
        activity: {
          id: 158,
          name: "Customer Feedback Analytics",
          color: "#2c3e50",
          description: "Analyze customer feedback data",
          activity_number: 265,
          budget: 1700,
          project_id: 127,
          team_id: 3,
          created_at: "2025-05-17T13:00:00.000Z",
          updated_at: "2025-05-17T13:00:00.000Z",
          deleted_at: null
        },
        expense: {
          id: 31,
          name: "Virtual meeting tools",
          description: "Video conferencing licenses",
          color: "#996633",
          project_id: 31,
          activity_id: 31,
          category_id: 31,
          cost: 170,
          created_at: "2025-03-22T10:40:00.000Z",
          updated_at: "2025-05-15T15:25:00.000Z",
          deleted_at: null
        }
      },
      duration: ["5:00", "0:15", "2:45", "2:45", "0:03", "5:45", ""],
      totalDuration: "0:03"
    },
    {
      task: {
        id: 150,
        title: "Develop autonomous decision system",
        deadline: "2025-05-25T00:00:00.000Z",
        description: "Create AI-powered decision making",
        user_id: "auth0|67d991b80f7916d942e25d1d",
        color: "#c2f485",
        status: "DOING",
        billable: true,
        is_paid: false,
        request_status: "APPROVED",
        activity_id: 155,
        expense_id: 61,
        quantity: 11,
        created_at: "2025-05-08T18:00:00.000Z",
        updated_at: "2025-05-08T18:00:00.000Z",
        deleted_at: null,
        activity: {
          id: 155,
          name: "Headless CMS Implementation",
          color: "#f39c12",
          description: "Implement headless content management system",
          activity_number: 262,
          budget: 2800,
          project_id: 125,
          team_id: 15,
          created_at: "2025-05-17T10:00:00.000Z",
          updated_at: "2025-05-17T10:00:00.000Z",
          deleted_at: null
        },
        expense: {
          id: 61,
          name: "Wireframing tools",
          description: "UI wireframe software",
          color: "#cccc33",
          project_id: 61,
          activity_id: 61,
          category_id: 61,
          cost: 92,
          created_at: "2025-03-02T15:15:00.000Z",
          updated_at: "2025-05-05T11:30:00.000Z",
          deleted_at: null
        }
      },
      duration: ["0:45", "3:45", "4:15", "5:15", "0:32", "1:45", ""],
      totalDuration: "0:32"
    }
  ]
};

export const mockProjectReviewReportData = {
  customers: [
    {
      id: 5,
      name: "Bob Johnson",
      color: "#ffb533"
    },
    {
      id: 4,
      name: "Alice Smith",
      color: "#33ffb5"
    },
    {
      id: 2,
      name: "Marrie Curiie",
      color: "#ff33be"
    },
    {
      id: 8,
      name: "Sophia Rodriguez",
      color: "#ff3385"
    }
  ],
  projects: [
    {
      id: 86,
      name: "Event Management Solution",
      color: "#5577dd",
      customer_id: 5,
      customer_name: "Bob Johnson",
      budget: 75000,
      spent: 6814.4699974154455,
      remaining: 68185.53000258455,
      budget_used_percentage: 0.09085959996553927,
      not_billed: 5737.844529145174,
      hourly_quota: 4086,
      last_entry: "2026-05-05",
      this_month: 100,
      total: 3209,
      not_exported: 45
    },
    {
      id: 74,
      name: "Enterprise Resource Planning",
      color: "#7733cc",
      customer_id: 4,
      customer_name: "Alice Smith",
      budget: 190000,
      spent: 60759.37574778278,
      remaining: 129240.62425221721,
      budget_used_percentage: 0.31978618814622517,
      not_billed: 4104.101191861903,
      hourly_quota: 1211,
      last_entry: "2026-04-05",
      this_month: 61,
      total: 4391,
      not_exported: 5
    },
    {
      id: 51,
      name: "Workflow Automation System",
      color: "#cc6633",
      customer_id: 2,
      customer_name: "Marrie Curiie",
      budget: 85000,
      spent: 74713.09870548117,
      remaining: 10286.90129451883,
      budget_used_percentage: 0.8789776318291902,
      not_billed: 65632.2484954391,
      hourly_quota: 3010,
      last_entry: "2025-04-10",
      this_month: 81,
      total: 1939,
      not_exported: 45
    },
    {
      id: 34,
      name: "Logistics Optimization",
      color: "#cc33ff",
      customer_id: 8,
      customer_name: "Sophia Rodriguez",
      budget: 90000,
      spent: 67950.49023955969,
      remaining: 22049.509760440313,
      budget_used_percentage: 0.7550054471062188,
      not_billed: 4918.248342542848,
      hourly_quota: 2818,
      last_entry: "2025-03-15",
      this_month: 69,
      total: 5057,
      not_exported: 86
    }
  ]
};

export const mockProjectData = [];

export const mockUserList = [
  {
    nickname: "superadmin",
    created_at: "2025-03-18T15:31:04.162Z",
    updated_at: "2025-06-15T15:55:52.140Z",
    user_id: "auth0|67d991b80f7916d942e25d1d",
    email: "superadmin@gmail.com",
    picture:
      "https://s.gravatar.com/avatar/6e088c3cf35987ad4e3dfc90e7b8dec6?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fsu.png",
    email_verified: false,
    identities: [
      {
        isSocial: false,
        connection: "Username-Password-Authentication",
        user_id: "67d991b80f7916d942e25d1d",
        provider: "auth0"
      }
    ],
    name: "Superadmin",
    last_login: "2025-06-15T15:55:52.140Z",
    last_ip: "14.191.94.187",
    logins_count: 671
  },
  {
    user_id: "auth0|67e177daa644c618cb3eb35e",
    name: "Anh Van Le",
    email_verified: false,
    identities: [
      {
        connection: "Username-Password-Authentication",
        user_id: "67e177daa644c618cb3eb35e",
        provider: "auth0",
        isSocial: false
      }
    ],
    email: "alee@gmail.com",
    nickname: "alee",
    picture:
      "https://s.gravatar.com/avatar/b1a7fa9e07e81e3e797a4b0c467f5fbf?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fal.png",
    created_at: "2025-03-24T15:18:50.061Z",
    updated_at: "2025-06-15T08:14:49.594Z",
    last_login: "2025-06-06T18:03:47.034Z",
    last_ip: "14.191.94.187",
    logins_count: 1
  },
  {
    email_verified: false,
    updated_at: "2025-06-06T18:00:47.232Z",
    identities: [
      {
        provider: "auth0",
        isSocial: false,
        connection: "Username-Password-Authentication",
        user_id: "67e177af85bc3d00c9259b50"
      }
    ],
    user_id: "auth0|67e177af85bc3d00c9259b50",
    email: "henry@gmail.com",
    picture:
      "https://s.gravatar.com/avatar/0b89014329de6287d545af884fe97076?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fhe.png",
    created_at: "2025-03-24T15:18:07.744Z",
    name: "Heny Louria",
    nickname: "henry",
    last_login: "2025-06-06T18:00:47.232Z",
    last_ip: "14.191.94.187",
    logins_count: 4
  },
  {
    updated_at: "2025-06-06T17:58:03.668Z",
    picture:
      "https://s.gravatar.com/avatar/85ab6f499d83390c09553e0993eeba8e?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fmi.png",
    email_verified: false,
    identities: [
      {
        isSocial: false,
        connection: "Username-Password-Authentication",
        user_id: "67e177f56da4043835d92e1a",
        provider: "auth0"
      }
    ],
    user_id: "auth0|67e177f56da4043835d92e1a",
    email: "mikasa@gmail.com",
    name: "Mikasa Shinyu",
    nickname: "mikasa",
    created_at: "2025-03-24T15:19:17.933Z",
    last_login: "2025-06-06T17:58:03.668Z",
    last_ip: "14.191.94.187",
    logins_count: 2
  },
  {
    email: "rose@gmail.com",
    picture:
      "https://s.gravatar.com/avatar/1b69a7741e2439e28d60785be6e56a30?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fro.png",
    email_verified: false,
    created_at: "2025-03-24T15:19:03.286Z",
    user_id: "auth0|67e177e769ff4468b60c246c",
    name: "Rose Blackpink",
    nickname: "rose",
    updated_at: "2025-06-06T17:57:01.016Z",
    identities: [
      {
        connection: "Username-Password-Authentication",
        user_id: "67e177e769ff4468b60c246c",
        provider: "auth0",
        isSocial: false
      }
    ],
    last_login: "2025-06-06T17:57:01.016Z",
    last_ip: "14.191.94.187",
    logins_count: 4
  }
];

export const mockReportCards: ReportViewType[] = [
  {
    title: "Weekly view for one user",
    type: ReportView.WEEKLY_USER,
    icon: <UserIcon className="h-6 w-6 text-pink-500" />,
    component: WeeklyUserReport,
    allowRoles: []
  },
  {
    type: ReportView.PROJECT_OVERVIEW,
    title: "Project overview",
    icon: <FolderIcon className="h-6 w-6 text-green-500" />,
    component: ProjectOverviewReport,
    allowRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD]
  }
];

export const mockDashboardReportData = {
  summary: {
    today: {
      hours: "0:00",
      trending: 4
    },
    week: {
      hours: "24:00",
      trending: 7
    },
    month: {
      hours: "64:35",
      trending: 19
    },
    year: {
      hours: "64:35",
      trending: 117
    }
  },
  chartData: [
    {
      date: "16-06",
      hour: 0
    },
    {
      date: "17-06",
      hour: 16
    },
    {
      date: "18-06",
      hour: 0
    },
    {
      date: "19-06",
      hour: 0
    },
    {
      date: "20-06",
      hour: 8
    },
    {
      date: "21-06",
      hour: 0
    },
    {
      date: "22-06",
      hour: 0
    }
  ]
};
