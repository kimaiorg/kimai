"use client";
import ErrorPage from "@/app/error";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const { user, error, isLoading } = useUser();

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return (
            <ErrorPage
                statusCode={401}
                message="Unauthorized"
            />
        );
    }

    if (user) {
        router.replace("/dashboard");
    } else {
        window.location.href = "/api/auth/login";
    }

    return <p>Redirecting...</p>;
}
