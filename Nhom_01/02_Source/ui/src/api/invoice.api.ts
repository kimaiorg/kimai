import { getManagementAccessToken } from "@/api/auth.api";
import { invoiceAxios } from "@/api/axios";
import { PaginationV2 } from "@/type_schema/common";
import {
  FilterInvoiceRequestDTO,
  InvoiceHistoryDataResponseType,
  InvoiceHistoryRequestType,
  InvoiceHistoryResponseType,
  InvoiceHistoryType,
  InvoiceTemplateType,
  UpdateInvoiceRequestDTO
} from "@/type_schema/invoice";

export async function filterInvoices(request: FilterInvoiceRequestDTO): Promise<InvoiceHistoryResponseType> {
  const token = await getManagementAccessToken();

  try {
    const response = await invoiceAxios.post(`/api/v1/invoices/filter`, request, {
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

  try {
    const response = await invoiceAxios.post(`/api/v1/invoices/generate`, invoice, {
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
): Promise<PaginationV2<InvoiceHistoryType>> {
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
  const response = await invoiceAxios.get<InvoiceHistoryDataResponseType>(`/api/v1/invoices?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  console.log(response.data);
  const data = response.data.data;
  return data;
}

export async function updateInvoiceStatus(request: UpdateInvoiceRequestDTO, invoiceId: string): Promise<any> {
  const token = await getManagementAccessToken();

  try {
    const response = await invoiceAxios.put(`/api/v1/invoices/${invoiceId}`, request, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.status;
  } catch (error: any) {
    return error.response.status;
  }
}

export async function getInvoiceTemplateById(invoiceTemplateId: number): Promise<InvoiceTemplateType> {
  const token = await getManagementAccessToken();
  const response = await invoiceAxios.get<InvoiceTemplateType>(`/api/v1/invoice-templates/${invoiceTemplateId}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  const data = response.data;
  return data;
}
