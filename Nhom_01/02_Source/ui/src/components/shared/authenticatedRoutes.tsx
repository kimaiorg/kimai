"use client";

import ErrorPage from "@/app/error";
import { useAppSelector } from "@/lib/redux-toolkit/hooks";
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
        const { user } = useUser();

        // && containsRole(user.role, roles)
        const userRoles = useAppSelector((state) => state.userState.roles) as RoleType[];
        if (user) {
            if (containsRole(userRoles, roles)) {
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
                    statusCode={404}
                    message="Page not found"
                />
            );
        }
    };
};
