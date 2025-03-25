"use client";

import ErrorPage from "@/app/error";
import { useAppSelector } from "@/lib/redux-toolkit/hooks";
import { Role, RolePermissionType, RoleType } from "@/type_schema/role";
import { useUser } from "@auth0/nextjs-auth0/client";

// export const containsRole = (roles: RoleType[], specificRoles: Role[]) => {
//     if (roles.length === 0) return false;
//     if (specificRoles.length === 0) return true;
//     return (
//         specificRoles.filter((r) => {
//             return roles.filter((role) => role.name.toLowerCase() === r.toString().toLowerCase()).length > 0;
//         }).length > 0
//     );
// };

export const hasRole = (role: RoleType, specificRoles: Role[]) => {
  if (!role) return false;
  if (specificRoles.length === 0) return true;
  return (
    specificRoles.filter((r) => {
      return role.name.toLowerCase() === r.toString().toLowerCase();
    }).length > 0
  );
};

export const AuthenticatedRoute = (Component: any, roles: Role[]) => {
  return function AuthRoute(props: any) {
    const { user, error, isLoading } = useUser();
    const userRolePermissions = useAppSelector((state) => state.userState.privilege) as RolePermissionType;

    if (isLoading) {
      return <p>Loading...</p>;
    }
    if (error) {
      return (
        <ErrorPage
          statusCode={500}
          message="Something went wrong!"
        />
      );
    }

    if (user) {
      if (hasRole(userRolePermissions.role, roles)) {
        return <Component {...props} />;
      }
      return (
        <ErrorPage
          statusCode={404}
          message="Page not found"
        />
      );
    } else {
      return (
        <ErrorPage
          statusCode={401}
          message="Unauthorized"
        />
      );
    }
  };
};
