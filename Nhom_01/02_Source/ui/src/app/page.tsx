"use client";
import ErrorPage from "@/app/error";
import Loading from "@/app/loading";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace("/dashboard");
      } else if (!error) {
        window.location.href = "/api/auth/login";
      }
    }
  }, [user, error, isLoading, router]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <ErrorPage
        statusCode={401}
        message="Unauthorized"
      />
    );
  }

  return <Loading />;
}
