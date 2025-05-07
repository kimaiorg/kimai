import { getManagementAccessToken } from "@/api/auth.api";
import { Pagination } from "@/type_schema/common";
import {
  FilterInvoiceRequestDTO,
  InvoiceHistoryRequestType,
  InvoiceHistoryType,
  InvoiceTemplateType,
  UpdateInvoiceRequestDTO
} from "@/type_schema/invoice";
import axios from "axios";

const INVOICE_BACKEND_URL = process.env.INVOICE_BACKEND_URL;

export async function filterInvoices(request: FilterInvoiceRequestDTO): Promise<InvoiceHistoryType> {
  const token = await getManagementAccessToken();

  try {
    const response = await axios.post(`${INVOICE_BACKEND_URL}/api/v1/invoices/filter`, request, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    return error.response;
  }
}

export async function saveInvoice(invoice: InvoiceHistoryRequestType): Promise<any> {
  const token = await getManagementAccessToken();

  console.log(invoice);
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

export async function getAllInvoiceHistories(
  page?: number,
  limit?: number,
  keyword?: string,
  sortBy?: string,
  sortOrder?: string,
  fromDate?: string,
  toDate?: string,
  customerId?: string,
  status?: string
): Promise<Pagination<InvoiceHistoryType>> {
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
  if (fromDate) params.append("from_date", fromDate);
  if (toDate) params.append("to_date", toDate);
  if (customerId) params.append("customer_id", customerId);
  if (status) params.append("status", status);

  return {
    metadata: {
      total: 4,
      page: 1,
      limit: 10,
      totalPages: 1
    },
    data: JSON.parse(localStorage.getItem("invoiceHistoryList") || "[]") as InvoiceHistoryType[]
  };

  const response = await axios.get<Pagination<InvoiceHistoryType>>(`/api/v1/invoices?${params.toString()}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  const data = response.data;
  return data;
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
): Promise<Pagination<InvoiceTemplateType>> {
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

  const response = await axios.get<Pagination<InvoiceTemplateType>>(`/api/v1/invoice-templates?${params.toString()}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  const data = response.data;
  return data;
}

export async function getInvoiceTemplateById(invoiceTemplateId: number): Promise<InvoiceTemplateType> {
  const token = await getManagementAccessToken();
  const response = await axios.get<InvoiceTemplateType>(`/api/v1/invoice-templates/${invoiceTemplateId}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  const data = response.data;
  return data;
}

const fakeInvoiceTemplates = (): InvoiceTemplateType[] => {
  return [
    {
      id: 1,
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
      id: 2,
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
