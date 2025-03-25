"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ErrorPageProps {
  statusCode?: number;
  message?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ statusCode, message }) => {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-black px-4">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold text-red-500">{statusCode || "Error"}</h1>
        <p className="mt-4 text-lg text-gray-700 dark:text-white">{message || "Oops! Something went wrong."}</p>
        <div className="mt-6">
          {statusCode && [401].includes(statusCode) ? (
            <Button
              className="px-6 py-3 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition"
              onClick={() => router.push("/login")}
            >
              Back
            </Button>
          ) : (
            <Button
              className="px-6 py-3 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition"
              onClick={() => router.back()}
            >
              Back
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
