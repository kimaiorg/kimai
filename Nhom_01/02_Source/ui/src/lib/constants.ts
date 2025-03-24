import { PermissionType } from "@/type_schema/role";

export const allSystemPermissions: PermissionType[] = [
    {
        permission_name: "read:timesheets",
        description: "Read timesheets",
        resource_server_identifier: "kimai_app",
        resource_server_name: "kimai"
    },
    {
        permission_name: "update:timesheets",
        description: "Update timesheets",
        resource_server_identifier: "kimai_app",
        resource_server_name: "kimai"
    },
    {
        permission_name: "create:customers",
        description: "Create customers",
        resource_server_identifier: "kimai_app",
        resource_server_name: "kimai"
    },
    {
        permission_name: "read:customers",
        description: "Read customers",
        resource_server_identifier: "kimai_app",
        resource_server_name: "kimai"
    },
    {
        permission_name: "create:projects",
        description: "Create projects",
        resource_server_identifier: "kimai_app",
        resource_server_name: "kimai"
    },
    {
        permission_name: "read:projects",
        description: "Read projects",
        resource_server_identifier: "kimai_app",
        resource_server_name: "kimai"
    },
    {
        permission_name: "create:teams",
        description: "Create teams",
        resource_server_identifier: "kimai_app",
        resource_server_name: "kimai"
    },
    {
        permission_name: "read:teams",
        description: "Read teams",
        resource_server_identifier: "kimai_app",
        resource_server_name: "kimai"
    }
];
