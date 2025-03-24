"use client";

import {
    addPermissionForRole,
    deletePermissionForRole,
    getAllRolePermissions,
    getAllSystemPermissions,
    getUsersForEachRole
} from "@/api/auth.api";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
// import { allSystemPermissions } from "@/lib/constants";
import { PermissionType, Role, RolePermissionType, RoleUserType } from "@/type_schema/role";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

function RolePage() {
    // const userRolePermission = useAppSelector((state) => state.userState.privilege) as RolePermissionType;
    const fetchRolePermissionsRef = useRef<boolean>(false);
    const [rolePermissions, setRolePermissions] = useState<RolePermissionType[]>([]);
    const [allSystemPermissions, setAllSystemPermissions] = useState<PermissionType[]>([]);
    const [roleUsers, setRoleUsers] = useState<RoleUserType[]>([]);
    const updatePermissionRef = useRef<boolean>(false);

    useEffect(() => {
        const fetchRolePermissions = async () => {
            const result = await getAllRolePermissions();
            setRolePermissions(result);
            setTimeout(async () => {
                const permissions = await getAllSystemPermissions();
                setAllSystemPermissions(permissions);
            }, 500);
            setTimeout(async () => {
                const roleUserList = await getUsersForEachRole(result.map((rp) => rp.role));
                setRoleUsers(roleUserList);
            }, 1000);
        };
        if (!fetchRolePermissionsRef.current) {
            fetchRolePermissions();
            fetchRolePermissionsRef.current = true;
        }
    }, []);
    const updatePermissionForRole = async (
        rolePermission: RolePermissionType,
        permission: PermissionType,
        isAllowed: boolean
    ) => {
        if (rolePermission.role.name.toLowerCase() == Role.SUPER_ADMIN || updatePermissionRef.current) {
            return;
        }
        updatePermissionRef.current = true;

        const rolePermissionsClone = [...rolePermissions];
        const currentRoleIdx = rolePermissionsClone.findIndex((rp) => rp.role.id == rolePermission.role.id);
        const currentPermissions = [...rolePermissionsClone[currentRoleIdx].permissions];

        let status = 400;
        let message = "";
        if (isAllowed) {
            status = await deletePermissionForRole(
                rolePermission.role.id,
                permission.permission_name,
                permission.resource_server_identifier
            );
            if (status == 204) {
                message = `Permission has been removed from role ${rolePermission.role.name}`;
                const currentPermissionIdx = currentPermissions.findIndex(
                    (p) => p.permission_name == permission.permission_name
                );
                currentPermissions.splice(currentPermissionIdx, 1);
                rolePermissionsClone[currentRoleIdx].permissions = currentPermissions;
                setRolePermissions(rolePermissionsClone);
            } else {
                message = `Failed to remove permission from role ${rolePermission.role.name}`;
            }
        } else {
            status = await addPermissionForRole(
                rolePermission.role.id,
                permission.permission_name,
                permission.resource_server_identifier
            );

            if (status == 201) {
                message = `Permission has been added to role ${rolePermission.role.name}`;
                currentPermissions.push({ ...permission });
                rolePermissionsClone[currentRoleIdx].permissions = currentPermissions;
                setRolePermissions(rolePermissionsClone);
            } else {
                message = `Failed to add permission to role ${rolePermission.role.name}`;
            }
        }
        if (status == 201) {
            toast("Success", {
                description: message,
                className: "!bg-lime-500 !text-white"
            });
        } else if (status == 204) {
            toast("Success", {
                description: message,
                className: "!bg-sky-500 !text-white"
            });
        } else {
            toast("Error", {
                description: message,
                className: "!bg-red-500 !text-white"
            });
        }

        updatePermissionRef.current = false;
    };

    const hasPermission = (permission: PermissionType, targetPermissions: PermissionType[]) => {
        return (
            targetPermissions.filter(
                (targetPermission) => targetPermission.permission_name === permission.permission_name
            ).length > 0
        );
    };

    if (rolePermissions.length == 0 || allSystemPermissions.length == 0) return <div>Loading...</div>;

    return (
        <>
            <div className="p-6">
                <div className="grid grid-cols-2 gap-4 lg:gap-2 mb-8 ">
                    {roleUsers.map((roleUser, index) => (
                        <div
                            key={index}
                            className="p-4 border rounded-lg shadow-sm bg-white"
                        >
                            <h2 className="text-lg font-semibold">{roleUser.role.name}</h2>
                            <p>Quantity: {roleUser.userCount}</p>
                        </div>
                    ))}
                </div>

                <table className="min-w-full bg-white border rounded-lg shadow-sm table-layout">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 w-[40%]">Name</th>
                            {rolePermissions.map((rolePermission) => (
                                <th
                                    key={rolePermission.role.id}
                                    className="py-2 px-4 w-[15%]"
                                >
                                    {rolePermission.role.name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {allSystemPermissions.map((allSystemPermission, index) => (
                            <tr key={index}>
                                <td className="py-2 px-4 w-[40%]">{allSystemPermission.description}</td>
                                {rolePermissions.map((rolePermission) => {
                                    const isAllowed = hasPermission(allSystemPermission, rolePermission.permissions);
                                    const canUpdate = rolePermission.role.name.toLowerCase() !== Role.SUPER_ADMIN;
                                    return (
                                        <td
                                            key={rolePermission.role.id}
                                            className={`py-2 px-4 text-center`}
                                        >
                                            <span
                                                className={`inline-block px-2 py-1 rounded-full ${
                                                    isAllowed ? "bg-green-500 text-white" : "bg-gray-200"
                                                } ${canUpdate ? "cursor-pointer" : "cursor-not-allowed"}`}
                                                onClick={() =>
                                                    updatePermissionForRole(
                                                        rolePermission,
                                                        allSystemPermission,
                                                        isAllowed
                                                    )
                                                }
                                            >
                                                {isAllowed ? "Yes" : "No"}
                                            </span>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
export default AuthenticatedRoute(RolePage, [Role.SUPER_ADMIN]);
