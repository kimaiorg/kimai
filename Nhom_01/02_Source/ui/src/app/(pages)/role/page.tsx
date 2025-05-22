"use client";

import {
  addPermissionForRole,
  deletePermissionForRole,
  getAllRolePermissions,
  getAllSystemPermissions,
  getUsersForEachRole
} from "@/api/auth.api";
import { MemberHoverCard } from "@/app/(pages)/team/member-hover-card";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { RoleCardSkeleton } from "@/components/skeleton/card-skeleton";
import { TableSkeleton } from "@/components/skeleton/table-skeleton";
// import { allSystemPermissions } from "@/lib/constants";
import { PermissionType, Role, RolePermissionType, RoleType, RoleUserType } from "@/type_schema/role";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

function RolePage() {
  // const userRolePermission = useAppSelector((state) => state.userState.privilege) as RolePermissionType;
  const fetchRolePermissionsRef = useRef<boolean>(false);
  const [rolePermissions, setRolePermissions] = useState<RolePermissionType[]>([]);
  const [allSystemPermissions, setAllSystemPermissions] = useState<PermissionType[] | null>(null);
  const [roleUsers, setRoleUsers] = useState<RoleUserType[] | null>(null);
  const updatePermissionRef = useRef<boolean>(false);

  async function fetchUserEachRoles(roles: RoleType[], retries = 3, backoff = 300) {
    try {
      const roleUserList = await getUsersForEachRole(roles);
      setRoleUsers(roleUserList);
      return;
    } catch (error) {
      console.log("Try again");
    }
    return fetchUserEachRoles(roles, retries - 1, backoff * 2);
  }

  useEffect(() => {
    const fetchRolePermissions = async () => {
      const result = await getAllRolePermissions();
      setRolePermissions(result);
      setTimeout(async () => {
        const permissions = await getAllSystemPermissions();
        setAllSystemPermissions(permissions);
      }, 500);
      const roles = result.map((rp) => rp.role);
      setTimeout(async () => {
        await fetchUserEachRoles(roles);
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
      targetPermissions.filter((targetPermission) => targetPermission.permission_name === permission.permission_name)
        .length > 0
    );
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Role and Permissions</h1>
        <div className="flex items-center space-x-2"></div>
      </div>
      <div className="pt-2">
        <div className="grid grid-cols-2 gap-4 lg:gap-2 mb-8 ">
          {!roleUsers && <RoleCardSkeleton roleCount={4} />}
          {roleUsers &&
            roleUsers.map((roleUser, index) => {
              const users = roleUser.users || [];
              const displayUsers = users.slice(0, 6);
              const extraCount = users.length - 6;
              return (
                <div
                  key={index}
                  className="p-4 border rounded-lg shadow-sm bg-white dark:bg-slate-800 border-gray-200"
                >
                  <h2 className="text-lg font-semibold">{roleUser.role.name}</h2>
                  <div className="flex items-center gap-2 justify-between mt-2">
                    <div className="flex -space-x-1">
                      {displayUsers.map((user, idx) => (
                        <MemberHoverCard
                          member={user}
                          key={idx}
                        >
                          <div
                            className={`flex items-center justify-center h-8 w-8 cursor-pointer hover:ring-indigo-600 hover:ring-2 rounded-full`}
                          >
                            <img
                              key={idx}
                              src={user.picture}
                              alt={user.name}
                              className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 object-cover"
                            />
                          </div>
                        </MemberHoverCard>
                      ))}
                      {extraCount > 0 && (
                        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 dark:bg-slate-700 text-xs font-semibold border-2 border-white dark:border-slate-800">
                          +{extraCount}
                        </span>
                      )}
                    </div>
                    <span className="ml-3 text-gray-600 dark:text-gray-300">Quantity: {roleUser.userCount}</span>
                  </div>
                </div>
              );
            })}
        </div>

        <table className="min-w-full bg-white dark:bg-slate-800 border rounded-lg shadow-sm table-layout border-gray-200">
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
          {!allSystemPermissions && (
            <TableSkeleton
              columns={5}
              rows={15}
            />
          )}
          <tbody>
            {allSystemPermissions &&
              allSystemPermissions.map((allSystemPermission, index) => (
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
                          className={`inline-block px-2 py-1 rounded-md ${
                            isAllowed ? "bg-main text-white" : "bg-gray-200 dark:bg-slate-900"
                          } ${canUpdate ? "cursor-pointer" : "cursor-not-allowed"}`}
                          onClick={() => updatePermissionForRole(rolePermission, allSystemPermission, isAllowed)}
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
