export enum Role {
    SUPER_ADMIN = "superadmin",
    ADMIN = "admin",
    TEAM_LEAD = "teamlead",
    EMPLOYEE = "employee",
}

// export type RoleType = keyof typeof Role;

export type PermissionType = {
    id: string;
    name: string;
    description: string;
    createdAt: string;
};

export type RoleType = {
    id: string;
    name: string;
    description: string;
};
