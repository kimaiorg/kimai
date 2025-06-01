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

export const mockInvoiceData = {
  success: true,
  data: {
    invoiceId: 174878832,
    customer: {
      id: 99,
      name: "Stella Fischer",
      company: "Pi GmbH",
      address: "4040 Oak Boulevard, Munich, Germany",
      comment: "Electronics customer",
      visible: true,
      vatId: "VAT012345",
      number: "0123456789",
      country: "Germany",
      currency: "EUR",
      phone: "0410123456",
      fax: "",
      mobile: "",
      email: "stella@gmail.com",
      homepage: "https://stella-fischer.com",
      timezone: "Europe/Berlin",
      color: "#5577aa"
    },
    project: {
      id: 129,
      name: "Customer Onboarding Platform",
      color: "#77aa55",
      project_number: 229,
      order_number: 2023129,
      order_date: "2027-01-01T00:00:00.000Z",
      start_date: "2027-01-10T00:00:00.000Z",
      end_date: "2027-01-31T00:00:00.000Z",
      budget: 85000,
      customer_id: 99,
      created_at: "2025-07-21T10:15:42.000Z",
      updated_at: "2025-07-21T10:15:42.000Z",
      deleted_at: null,
      teams: [],
      customer: {
        id: 99,
        name: "Stella Fischer",
        color: "#5577aa",
        description: "Electronics customer",
        address: "4040 Oak Boulevard, Munich, Germany",
        company_name: "Pi GmbH",
        account_number: "0123456789",
        vat_id: "VAT012345",
        country: "Germany",
        currency: "EUR",
        timezone: "Europe/Berlin",
        email: "stella@gmail.com",
        phone: "0410123456",
        homepage: "https://stella-fischer.com",
        created_at: "2025-07-08T13:00:00.000Z",
        updated_at: "2025-07-08T13:00:00.000Z",
        deleted_at: null
      }
    },
    fromDate: "2025-04-01",
    toDate: "2025-07-01",
    status: "NEW",
    totalPrice: 5054,
    taxRate: 10,
    taxPrice: 505,
    finalPrice: 5559,
    currency: "USD",
    notes: "",
    createdBy: "system",
    createdAt: "2025-06-01T14:32:06.270Z",
    template: {
      id: 1,
      name: "Default Template",
      format: "A4",
      title: "Invoice",
      companyName: "Kimai Organization",
      vatId: "VAT123456",
      address: "123 Kimai Street, City",
      contact: "contact@kimai.org",
      termsOfPayment: "Payment due within 14 days",
      bankAccount: "BANK123456789",
      paymentTerm: "14 days",
      taxRate: "10%",
      language: "en",
      invoiceNumberGenerator: "standard",
      invoiceTemplate: "default",
      grouping: "activity",
      createdAt: "2025-06-01T14:32:06.269Z",
      updatedAt: "2025-06-01T14:32:06.269Z"
    },
    activities: [
      {
        id: 160,
        name: "Dynamic Pricing Engine",
        description: "Develop dynamic pricing algorithm engine",
        color: "#3498db",
        created_at: "2025-06-17T15:00:00.000Z",
        totalPrice: 3164,
        tasks: [
          {
            id: 144,
            title: "Develop sentiment analysis engine",
            description: "Create emotion detection system",
            status: "DOING",
            billable: true,
            quantity: 8,
            price: 58,
            deadline: "2025-04-25T00:00:00.000Z",
            created_at: "2025-06-08T12:00:00.000Z",
            color: "#ff3399"
          },
          {
            id: 133,
            title: "Create quantum computing prototype",
            description: "Develop quantum algorithm implementation",
            status: "DONE",
            billable: true,
            quantity: 12,
            price: 65,
            deadline: "2025-03-01T00:00:00.000Z",
            created_at: "2025-06-07T11:00:00.000Z",
            color: "#33ff99"
          },
          {
            id: 122,
            title: "Implement document OCR system",
            description: "Create text extraction from images",
            status: "DONE",
            billable: true,
            quantity: 6,
            price: 320,
            deadline: "2025-01-05T00:00:00.000Z",
            created_at: "2025-06-06T10:00:00.000Z",
            color: "#9933ff"
          }
        ]
      },
      {
        id: 148,
        name: "Customer Journey Optimization",
        description: "Optimize customer journey touchpoints",
        color: "#f1c40f",
        created_at: "2025-06-16T12:00:00.000Z",
        totalPrice: 1890,
        tasks: [
          {
            id: 14,
            title: "Setup cloud infrastructure",
            description: "Configure cloud services",
            status: "DONE",
            billable: true,
            quantity: 9,
            price: 210,
            deadline: "2025-07-05T00:00:00.000Z",
            created_at: "2025-05-26T16:00:00.000Z",
            color: "#3399ff"
          }
        ]
      }
    ]
  },
  filteredInvoiceId: 3
};
