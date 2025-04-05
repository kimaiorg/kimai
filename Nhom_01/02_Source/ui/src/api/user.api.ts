import { createAccessToken } from "@/api/auth.api";
import mockUser from "@/lib/mock-users.json";
import { CreateUserRequestDTO, UserListType } from "@/type_schema/user.schema";

export async function getAllUsers2(page: number, perPage: number): Promise<UserListType> {
  const total = mockUser.length;
  const users = mockUser.slice((page - 1) * perPage, page * perPage);
  const data: UserListType = {
    start: (page - 1) * perPage,
    limit: perPage,
    length: users.length,
    total: total,
    users: users
  };
  return data;
}

export async function getAllUsers(page?: number, perPage?: number): Promise<UserListType> {
  const token = await createAccessToken(process.env.AUTH0_IAM_API_AUDIENCE!);

  const params = new URLSearchParams();
  params.set("include_totals", "true");
  if (page) params.set("page", (page - 1).toString());
  if (perPage) params.set("per_page", perPage.toString());

  const BASE_URL = process.env.AUTH0_ISSUER_BASE_URL;
  const response = await fetch(`${BASE_URL}/api/v2/users?${params.toString()}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  const data = await response.json();
  console.log(data);
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
  if (roleResponse.status != 204) {
    return roleResponse.status;
  }
  return 201;
}
