import { getManagementAccessToken } from "@/api/auth.api";
import { Pagination } from "@/type_schema/common";
import {
  FilterInvoiceRequestDTO,
  InvoiceHistoryType,
  InvoiceTemplate,
  UpdateInvoiceRequestDTO
} from "@/type_schema/invoice";
import axios from "axios";

const INVOICE_BACKEND_URL = process.env.INVOICE_BACKEND_URL;

export async function filterInvoices(request: FilterInvoiceRequestDTO): Promise<any> {
  const token = await getManagementAccessToken();
  console.log(request);
  return 200;
  try {
    const response = await axios.post(`${INVOICE_BACKEND_URL}/api/v1/invoices/filter`, request, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.status;
  } catch (error: any) {
    return error.response.status;
  }
}

// BE trước khi return => lưu tạm => Invoice id temp. => save invoice => invoice id real
// const invoiceFilterResponse = {
//   data: {
//     invoice_id_temp: "id",
//     totalMoney: 1110,
//     totalDuration: 129,
//     customer: CustomerType,
//     activities: [
//       {
//         name: "",
//         // Activity Type
//         tasks: [
//           // Task Type
//         ]
//       },
//       {
//         name: "",
//         // Activity Type
//         tasks: [
//           // Task Type
//         ]
//       }
//     ]
//   }
// };

// invoice/generate
// Client
const payload = {
  invoice_id: "invoice_id_temp",
  notes: ""
};

export async function saveInvoice(invoice: InvoiceHistoryType): Promise<any> {
  const token = await getManagementAccessToken();
  return 200;
  try {
    const response = await axios.post(`${INVOICE_BACKEND_URL}/api/v1/invoices/generate`, invoice, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.status;
  } catch (error: any) {
    return error.response.status;
  }
}

export async function updateInvoiceStatus(request: UpdateInvoiceRequestDTO, invoiceId: string): Promise<any> {
  const token = await getManagementAccessToken();

  // const invoiceHistories = JSON.parse(localStorage.getItem("invoiceHistoryList") || "[]") as InvoiceHistoryType[];
  // const invoiceHistory = invoiceHistories.findIndex((item) => item.id === invoiceId);
  // if (invoiceHistory !== -1) {
  //   invoiceHistories[invoiceHistory].status = request.status;
  //   invoiceHistories[invoiceHistory].dueDate = request.paymentDate;
  //   invoiceHistories[invoiceHistory].notes = request.description;
  // }
  // localStorage.setItem("invoiceHistoryList", JSON.stringify(invoiceHistories));

  // return 200;
  try {
    const response = await axios.post(`/api/v1/invoices/generate`, request, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.status;
  } catch (error: any) {
    return error.response.status;
  }
}

export async function getAllInvoiceTemplates(
  page?: number,
  limit?: number,
  keyword?: string,
  sortBy?: string,
  sortOrder?: string,
  isActive?: boolean
): Promise<Pagination<InvoiceTemplate>> {
  const token = await getManagementAccessToken();

  const params = new URLSearchParams();
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());
  if (keyword) params.append("keyword", keyword);
  if (sortBy) {
    params.append("sort_by", sortBy);
    const order = sortOrder === "asc" ? "asc" : "desc";
    params.append("sort_order", order);
  }
  if (isActive) params.append("is_active", isActive.toString());

  return {
    metadata: {
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1
    },
    data: fakeInvoiceTemplates()
  };

  const response = await axios.get<Pagination<InvoiceTemplate>>(`/api/v1/invoice-templates?${params.toString()}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  const data = response.data;
  return data;
}

export async function getInvoiceTemplateById(invoiceTemplateId: number): Promise<InvoiceTemplate> {
  const token = await getManagementAccessToken();
  const response = await axios.get<InvoiceTemplate>(`/api/v1/invoice-templates/${invoiceTemplateId}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  const data = response.data;
  return data;
}

const fakeInvoiceTemplates = (): InvoiceTemplate[] => {
  return [
    {
      id: "1",
      name: "Default Template",
      format: "PDF",
      title: "Invoice",
      companyName: "Abbott-Gerlach",
      vatId: "51323653524006",
      address: "5687 Greenfelder Pine\n99349 East Zoey, Macao",
      contact: "Phone: 857.919.4369\nEmail: leannon.cassie@example.org\nWeb: www.example.org",
      termsOfPayment: "I would like to thank you for your confidence and will gladly be there for you again!",
      bankAccount: "Acme Bank\nBIC: AAISANBXBW\nIBAN: DE07700111109999999999",
      paymentTerm: "30",
      taxRate: "0.000",
      language: "English",
      invoiceNumberGenerator: "Configured format",
      invoiceTemplate: "Invoice",
      grouping: "Default (one row per entry)",
      createdAt: new Date().toISOString()
    },
    {
      id: "2",
      name: "HTML Template",
      format: "HTML",
      title: "Invoice",
      companyName: "Kimai Inc.",
      vatId: "DE123456789",
      address: "123 Main Street\nBerlin, Germany 10115",
      contact: "Phone: +49 30 123456\nEmail: info@kimai.org\nWeb: www.kimai.org",
      termsOfPayment: "Thank you for your business!",
      bankAccount: "Deutsche Bank\nBIC: DEUTDEFFXXX\nIBAN: DE89370400440532013000",
      paymentTerm: "14",
      taxRate: "19.000",
      language: "English",
      invoiceNumberGenerator: "Configured format",
      invoiceTemplate: "Invoice",
      grouping: "Activity",
      createdAt: new Date().toISOString()
    }
  ];
};
