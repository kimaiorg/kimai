"use client";

import Loading from "@/app/loading";
import ErrorPage from "@/app/error";
import { useAppDispatch, useAppSelector } from "@/lib/redux-toolkit/hooks";
import { updateUser } from "@/lib/redux-toolkit/slices/userSlice";
import { useCachedUserInfo } from "@/lib/react-query/userCache";
import { UserType } from "@/type_schema/user.schema";
import { Role, RoleType } from "@/type_schema/role";
import { useUser } from "@auth0/nextjs-auth0/client";

export const containsRole = (roles: RoleType[], specificRoles: Role[]) => {
    if (roles.length === 0) return false;
    if (specificRoles.length === 0) return true;
    return (
        specificRoles.filter((r) => {
            return roles.filter((role) => role.name.toLowerCase() === r.toString().toLowerCase()).length > 0;
        }).length > 0
    );
};

export const AuthenticatedRoute = (Component: any, roles: Role[]) => {
    return function AuthRoute(props: any) {
        // const dispatch = useAppDispatch();
        // const { data: currentUser, isLoading, isError, isFetched } = useCachedUserInfo();
        // if (isError) return <ErrorPage />;
        // if (isFetched) {
        //     if (currentUser == null) return <ErrorPage statusCode={404} message="Page not found" />;
        // }
        // if (!isLoading && (currentUser == null || currentUser.hasOwnProperty("errorCode"))) {
        //     return <ErrorPage statusCode={404} message="Page not found" />;
        // }
        // if (!isLoading && currentUser) {
        // }
        // const user = useAppSelector((state) => state.userState.user) as UserType;
        const { user, error, isLoading } = useUser();

        // && containsRole(user.role, roles)
        if (user) {
            const userRoles = useAppSelector((state) => state.userState.roles) as RoleType[];
            if (containsRole(userRoles, roles)) {
                return <Component {...props} />;
            }
            return <ErrorPage statusCode={404} message="Page not found" />;
        } else {
            return <ErrorPage statusCode={404} message="Page not found" />;
        }
    };
};
