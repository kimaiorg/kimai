import { getManagementAccessToken } from "@/api/auth.api";
import { projectAxios } from "@/api/axios";
import { Pagination } from "@/type_schema/common";
import { CreateCustomerRequestDTO, CustomerType, UpdateCustomerRequestDTO } from "@/type_schema/customer";

export async function getAllCustomers(
  page?: number,
  perPage?: number,
  keyword?: string,
  sortBy?: string,
  sortOrder?: string
): Promise<Pagination<CustomerType>> {
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

  const response = await projectAxios.get<Pagination<CustomerType>>(`/api/v1/customers?${params.toString()}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  const data = response.data;
  return data;
}

export async function addNewCustomer(request: CreateCustomerRequestDTO): Promise<number> {
  const token = await getManagementAccessToken();
  const payload = { ...request };
  try {
    const response = await projectAxios.post(`/api/v1/customers`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.status;
  } catch (error: any) {
    return error.response.status;
  }
}

export async function updateCustomer(request: UpdateCustomerRequestDTO, customerId: number): Promise<number> {
  const token = await getManagementAccessToken();
  const payload = { ...request };
  try {
    const response = await projectAxios.put(`/api/v1/customers/${customerId}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.status;
  } catch (error: any) {
    return error.response.status;
  }
}
