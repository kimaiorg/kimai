"use client";
import { UpdateUserForm } from "@/app/(pages)/profile/update-user-form";
import ErrorPage from "@/app/error";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function UserDetails() {
  const [update, setUpdate] = useState<boolean>(false);
  const { user, isLoading } = useUser();
  const { t } = useTranslation();
  if (!isLoading && !user) {
    toast("Unauthorized", {
      description: "You are not authorized to view this page",
      className: "!bg-red-500 !text-white"
    });
    return (
      <ErrorPage
        statusCode={401}
        message="Unauthorized"
      />
    );
  }
  // console.log(user);
  return (
    <>
      {update ? (
        <>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-4xl font-bold">Update info</h1>
          </div>
          <div className="mx-4 sm:w-sm md:w-sm lg:w-sm xl:w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto bg-white dark:bg-black shadow-xl rounded-lg ">
            <UpdateUserForm
              user={user!}
              back={() => setUpdate(!update)}
            />
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-4xl font-bold">User information {t("sidebar.user")}</h1>
          </div>
          <div className="mx-4 w-[80%] sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto bg-white dark:bg-black shadow-xl rounded-lg">
            <div className="rounded-t-lg h-48 overflow-hidden">
              <img
                className="object-cover object-top w-full"
                src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
                alt="Mountain"
              />
            </div>
            <div className="mx-auto w-52 h-52 relative -mt-32 border-4 border-white rounded-full overflow-hidden">
              <img
                className="object-cover object-center h-52"
                src={
                  (user!.image as string) ||
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
                }
                alt="Woman looking front"
              />
            </div>
            <div className="flex flex-col mt-2 justify-center items-center gap-1">
              <h2 className="font-semibold text-2xl">Sarah Smith</h2>
            </div>
            <div className="info-section bg-white dark:bg-black shadow-md border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
              <div className="info-item flex justify-between items-center py-2 border-b">
                <span className="info-label font-medium ">ID:</span>
                <span className="info-value">{user?.name}</span>
              </div>
              <div className="info-item flex justify-between items-center py-2 border-b">
                <span className="info-label font-medium ">Email:</span>
                <span className="info-value">{user?.email}</span>
              </div>
              <div className="info-item flex justify-between items-center py-2 border-b">
                <span className="info-label font-medium ">Status:</span>
                <span className="info-value">{user?.email_verified ? "Verified" : "N/A"}</span>
              </div>
              <div className="info-item flex justify-between items-center py-2 border-b">
                <span className="info-label font-medium ">Role:</span>
                Admin
              </div>
            </div>
            <div className="flex justify-center items-center py-5 gap-4">
              <Button className="cancel-btn-color text-md">
                <Link href="/admin/users">Back</Link>
              </Button>
              <Button
                onClick={() => setUpdate(!update)}
                className="px-2 py-[.39rem]"
              >
                Update info
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
