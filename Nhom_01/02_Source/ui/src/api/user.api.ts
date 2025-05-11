import { createAccessToken } from "@/api/auth.api";
import { removeTokens } from "@/api/axios";
import { CreateUserRequestDTO, UpdateUserRequestDTO, UserListType } from "@/type_schema/user.schema";

export async function getAllUsers(
  page?: number,
  perPage?: number,
  keyword?: string,
  sortBy?: string,
  sortOrder?: string
): Promise<UserListType> {
  const token = await createAccessToken(process.env.AUTH0_IAM_API_AUDIENCE!);

  const params = new URLSearchParams();
  params.set("include_totals", "true");
  if (page) params.set("page", (page - 1).toString());
  if (perPage) params.set("per_page", perPage.toString());
  if (keyword) params.set("q", `email:"${keyword}" OR name:"${keyword}"`);
  if (sortBy) {
    const order = sortOrder === "asc" ? "1" : "-1";
    params.set("sort", `${sortBy}:${order}`);
  }

  const BASE_URL = process.env.AUTH0_ISSUER_BASE_URL;
  const response = await fetch(`${BASE_URL}/api/v2/users?${params.toString()}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  if (response.status === 401) {
    removeTokens();
  }
  const data = await response.json();
  return data;
}

export async function addNewUser(request: CreateUserRequestDTO): Promise<number> {
  const token = await createAccessToken(process.env.AUTH0_IAM_API_AUDIENCE!);

  const BASE_URL = process.env.AUTH0_ISSUER_BASE_URL;
  const payload = {
    connection: "Username-Password-Authentication",
    email: request.email,
    password: request.password,
    name: request.name
  };
  const userResponse = await fetch(`${BASE_URL}/api/v2/users`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  if (userResponse.status === 401) {
    removeTokens();
  }
  if (userResponse.status != 201) {
    return userResponse.status;
  }
  const data = await userResponse.json();
  const userId = data.user_id;

  await new Promise((resolve) => setTimeout(resolve, 1000));
  const rolePayload = { roles: [request.roleId] };
  const roleResponse = await fetch(`${BASE_URL}/api/v2/users/${userId}/roles`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(rolePayload)
  });
  if (roleResponse.status === 401) {
    removeTokens();
  }
  if (roleResponse.status != 204) {
    return roleResponse.status;
  }
  return 201;
}

export async function updateUser(request: UpdateUserRequestDTO, uId: string, oldRoleId: string): Promise<number> {
  console.log(request, uId, oldRoleId);
  const token = await createAccessToken(process.env.AUTH0_IAM_API_AUDIENCE!);

  const BASE_URL = process.env.AUTH0_ISSUER_BASE_URL;
  const payload = {
    connection: "Username-Password-Authentication",
    email: request.email,
    name: request.name
  };
  const userResponse = await fetch(`${BASE_URL}/api/v2/users/${uId}`, {
    method: "PATCH",
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  if (userResponse.status === 401) {
    removeTokens();
  }
  if (userResponse.status != 200) {
    return userResponse.status;
  }
  const data = await userResponse.json();
  const userId = data.user_id;
  if (request.roleId == oldRoleId) {
    return 200;
  }

  // Delete old role
  await new Promise((resolve) => setTimeout(resolve, 550));
  const oldRolePayload = { roles: [oldRoleId] };
  const oldRoleResponse = await fetch(`${BASE_URL}/api/v2/users/${userId}/roles`, {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(oldRolePayload)
  });
  if (oldRoleResponse.status === 401) {
    removeTokens();
  }
  if (oldRoleResponse.status != 204) {
    return oldRoleResponse.status;
  }

  // Add new role
  await new Promise((resolve) => setTimeout(resolve, 550));
  const rolePayload = { roles: [request.roleId] };
  const roleResponse = await fetch(`${BASE_URL}/api/v2/users/${userId}/roles`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(rolePayload)
  });
  if (roleResponse.status === 401) {
    removeTokens();
  }
  if (roleResponse.status != 204) {
    return roleResponse.status;
  }
  return 200;
}
