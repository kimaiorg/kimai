export enum Role {
  SUPER_ADMIN = "superadmin",
  ADMIN = "admin",
  TEAM_LEAD = "teamlead",
  EMPLOYEE = "employee"
}

// export type RoleType = keyof typeof Role;

export type PermissionType = {
  permission_name: string;
  description: string;
  resource_server_identifier: string;
  resource_server_name: string;
};

export type RoleType = {
  id: string;
  name: string;
  description: string;
};

export type RolePermissionType = {
  role: RoleType;
  permissions: PermissionType[];
};

export type RoleUserType = {
  role: RoleType;
  userCount: number;
};
