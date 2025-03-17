"use client";
import { getUsersRoles } from "@/api/auth.api";
import ErrorPage from "@/app/error";
import { useAppDispatch } from "@/lib/redux-toolkit/hooks";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { updateRole } from "@/lib/redux-toolkit/slices/userSlice";
import { useEffect } from "react";

export default function Home() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user, error, isLoading } = useUser();

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <ErrorPage statusCode={401} message="Unauthorized" />;
    }

    if (user) {
        console.log(user);
        const fetchUserRoles = async () => {
            const roles = await getUsersRoles(user!.sub!);
            if (roles.length === 0) {
                window.location.href = "/api/auth/login";
            }
            dispatch(updateRole(roles));
            router.replace("/dashboard");
        };
        try {
            fetchUserRoles();
        } catch (error) {
            console.log(error);
            window.location.href = "/api/auth/login";
        }
    } else {
        window.location.href = "/api/auth/login";
    }

    return <p>Redirecting...</p>;
}
