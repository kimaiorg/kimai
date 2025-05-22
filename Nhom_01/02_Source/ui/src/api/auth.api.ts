import { PermissionType, RolePermissionType, RoleType, RoleUserType } from "@/type_schema/role";
import axios from "axios";

// Auth0 Management API: https://auth0.com/docs/api/management/v2

type AccessTokenResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

// Create an access token for calling apis
export async function createAccessToken(audience: string, count: number = 3): Promise<string> {
  try {
    if (count == 0) return "";
    if (sessionStorage.getItem("token")) return sessionStorage.getItem("token")!;
    const issuerBaseURL = `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`;
    const response = await axios.post<AccessTokenResponse>(
      issuerBaseURL,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.AUTH0_CLIENT_ID!,
        client_secret: process.env.AUTH0_CLIENT_SECRET!,
        audience: audience
      }),
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded"
        }
      }
    );
    sessionStorage.setItem("token", response.data.access_token);
    return response.data.access_token;
  } catch (error: any) {
    sessionStorage.removeItem("token");
    return createAccessToken(audience, count - 1);
  }
}

export async function getManagementAccessToken(count: number = 3): Promise<string> {
  if (count == 0) return "";
  try {
    if (sessionStorage.getItem("backend-at-token")) return sessionStorage.getItem("backend-at-token")!;
    const response = await axios.get<{ accessToken: string }>("/api/token/api-server");

    sessionStorage.setItem("backend-at-token", response.data.accessToken);
    return response.data.accessToken;
  } catch (error) {
    sessionStorage.removeItem("backend-at-token");
    return getManagementAccessToken(count - 1);
  }
}

export async function getAllSystemPermissions(): Promise<PermissionType[]> {
  const token = await createAccessToken(process.env.AUTH0_IAM_API_AUDIENCE!);

  const BASE_URL = process.env.AUTH0_ISSUER_BASE_URL;
  const API_ID = process.env.AUTH0_KIMAI_API_ID;
  const response = await fetch(`${BASE_URL}/api/v2/resource-servers/${API_ID}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  const data = await response.json();

  const identifier = data.identifier;
  const serverName = data.name;
  const permissions: PermissionType[] = data.scopes.map((scope: any) => {
    return {
      permission_name: scope.value,
      description: scope.description,
      resource_server_identifier: identifier,
      resource_server_name: serverName
    };
  });
  return permissions;
}

export async function getUsersForEachRole(roles: RoleType[]): Promise<RoleUserType[]> {
  const token = await createAccessToken(process.env.AUTH0_IAM_API_AUDIENCE!);
  const fetchPromises = roles.map((role) =>
    fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/roles/${role.id}/users`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      }
    })
  );

  const roleUsers: RoleUserType[] = await Promise.all(
    fetchPromises.map(async (fetchPromise, index) => {
      const response = await fetchPromise; // Await the actual response

      const users = (await response.json()) as any[];

      return {
        role: roles[index],
        users,
        userCount: users.length || 99
      };
    })
  );

  return roleUsers;
}

export async function addPermissionForRole(
  roleId: string,
  permissionName: string,
  serverIdentifier: string
): Promise<number> {
  const token = await createAccessToken(process.env.AUTH0_IAM_API_AUDIENCE!);

  const payload = JSON.stringify({
    permissions: [
      {
        resource_server_identifier: serverIdentifier,
        permission_name: permissionName
      }
    ]
  });
  const response = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/roles/${roleId}/permissions`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: payload
  });
  return response.status;
}

export async function deletePermissionForRole(
  roleId: string,
  permissionName: string,
  serverIdentifier: string
): Promise<number> {
  const token = await createAccessToken(process.env.AUTH0_IAM_API_AUDIENCE!);

  const payload = JSON.stringify({
    permissions: [
      {
        resource_server_identifier: serverIdentifier,
        permission_name: permissionName
      }
    ]
  });
  const response = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/roles/${roleId}/permissions`, {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: payload
  });
  return response.status;
}

export async function getUserRolePermissions(userId: string): Promise<RolePermissionType> {
  const token = await createAccessToken(process.env.AUTH0_IAM_API_AUDIENCE!);

  await new Promise((resolve) => setTimeout(resolve, 500));
  const roleResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${userId}/roles`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  const roleData: RoleType[] = await roleResponse.json();
  console.log(roleData);
  const role = roleData[0];

  await new Promise((resolve) => setTimeout(resolve, 500));
  const permissionsResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/roles/${role.id}/permissions`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  const permissionsData: PermissionType[] = await permissionsResponse.json();

  return { role, permissions: permissionsData };
}

export async function getAllRolePermissions(): Promise<RolePermissionType[]> {
  const token = await createAccessToken(process.env.AUTH0_IAM_API_AUDIENCE!);

  await new Promise((resolve) => setTimeout(resolve, 500));
  const systemRolesResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/roles`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  const systemRoles: RoleType[] = await systemRolesResponse.json();
  const roleIds: string[] = systemRoles.map((role) => role.id);

  const fetchPromises = roleIds.map((roleId) =>
    fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/roles/${roleId}/permissions`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      }
    })
  );

  const rolePermissions: RolePermissionType[] = await Promise.all(
    fetchPromises.map(async (fetchPromise, index) => {
      const response = await fetchPromise; // Await the actual response

      if (!response.ok) {
        throw new Error(`Failed to fetch permissions for role at index ${index}`);
      }

      const permissions = (await response.json()) as PermissionType[];

      return {
        role: systemRoles[index], // Ensure correct mapping
        permissions
      };
    })
  );

  return rolePermissions;
}

export async function getAllRoles(): Promise<RoleType[]> {
  const token = await createAccessToken(process.env.AUTH0_IAM_API_AUDIENCE!);

  const systemRolesResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/roles`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  const systemRoles: RoleType[] = await systemRolesResponse.json();

  return systemRoles;
}
