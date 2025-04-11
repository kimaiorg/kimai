import { getManagementAccessToken } from "@/api/auth.api";
import { myAxios } from "@/api/axios";
import { Pagination } from "@/type_schema/common";
import { FilterInvoiceRequestDTO, InvoiceHistoryType, UpdateInvoiceRequestDTO } from "@/type_schema/invoice";
import { CreateProjectRequestDTO, ProjectType } from "@/type_schema/project";

export async function getAllProjects(
  page?: number,
  perPage?: number,
  keyword?: string,
  sortBy?: string,
  sortOrder?: string
): Promise<Pagination<ProjectType>> {
  const token = await getManagementAccessToken();

  const params = new URLSearchParams();
  if (page) params.append("page", page.toString());
  if (perPage) params.append("limit", perPage.toString());
  if (keyword) params.append("keyword", keyword);
  if (sortBy) {
    params.append("sort_by", sortBy);
    const order = sortOrder === "asc" ? "asc" : "desc";
    params.append("sort_order", order);
  }
  const response = await myAxios.get<Pagination<ProjectType>>(`/api/v1/projects?${params.toString()}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  const data = response.data;
  return data;
}

export async function addNewProject(request: CreateProjectRequestDTO): Promise<number> {
  const token = await getManagementAccessToken();
  const payload = { ...request };
  try {
    const response = await myAxios.post(`/api/v1/projects`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.status;
  } catch (error: any) {
    return error.response.status;
  }
}

export async function filterInvoices(request: FilterInvoiceRequestDTO): Promise<any> {
  const token = await getManagementAccessToken();

  return 200;
  try {
    const response = await myAxios.post(`/api/v1/invoices`, request, {
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

  const invoiceHistories = JSON.parse(localStorage.getItem("invoiceHistoryList") || "[]") as InvoiceHistoryType[];
  const invoiceHistory = invoiceHistories.findIndex((item) => item.id === invoiceId);
  if (invoiceHistory !== -1) {
    invoiceHistories[invoiceHistory].status = request.status;
    invoiceHistories[invoiceHistory].dueDate = request.paymentDate;
    invoiceHistories[invoiceHistory].notes = request.description;
  }
  localStorage.setItem("invoiceHistoryList", JSON.stringify(invoiceHistories));

  return 200;
  try {
    const response = await myAxios.post(`/api/v1/invoices`, request, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.status;
  } catch (error: any) {
    return error.response.status;
  }
}
