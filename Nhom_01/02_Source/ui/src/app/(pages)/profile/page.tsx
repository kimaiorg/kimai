"use client";
import { UpdateUserForm } from "@/app/(pages)/profile/update-user-form";
import UploadFileModal from "@/app/(pages)/profile/upload-file-modal";
import ErrorPage from "@/app/error";
import DefaultAvatar from "@/components/shared/default-avatar";
import { Button } from "@/components/ui/button";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function UserDetails() {
  const [update, setUpdate] = useState<boolean>(false);
  const { user, isLoading } = useUser();
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const router = useRouter();

  if (isLoading || !user) {
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

  const handleUploadBackground = (file: File) => {
    setBackgroundFile(file);
  };

  const handleUploadAvatar = (file: File) => {
    setAvatarFile(file);
  };

  // console.log(user);
  return (
    <div className="py-5 px-10">
      {update ? (
        <>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-4xl font-bold">Update info</h1>
          </div>
          <div className="mx-4 sm:w-sm md:w-sm lg:w-sm xl:w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto bg-white dark:bg-black shadow-xl rounded-lg ">
            <UpdateUserForm
              user={user}
              back={() => setUpdate(!update)}
            />
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-4xl font-bold">User information</h1>
          </div>
          <div className="mx-4 sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto bg-white dark:bg-slate-800 shadow-xl rounded-lg">
            <div className="rounded-t-lg h-60 overflow-hidden group relative">
              {backgroundFile ? (
                <img
                  className="object-cover object-top w-full"
                  src={URL.createObjectURL(backgroundFile)}
                  alt="Mountain"
                />
              ) : (
                <img
                  className="object-cover object-top w-full"
                  src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
                  alt="Mountain"
                />
              )}
              <div className="absolute bottom-3 right-3 hidden group-hover:flex items-center justify-center bg-black border border-white p-2 rounded-full shadow-lg cursor-pointer">
                <UploadFileModal onUploadFile={handleUploadBackground}>
                  <Upload className="w-5 h-5 text-white" />
                </UploadFileModal>
              </div>
            </div>
            <div className="group relative w-fit mx-auto ">
              <div className="w-52 h-52 -mt-32 border-4 border-white rounded-full overflow-hidden">
                {user?.image ? (
                  <img
                    className="object-cover object-center h-52"
                    src={user.image as string}
                    alt="Woman looking front"
                  />
                ) : avatarFile ? (
                  <img
                    className="object-cover object-center h-52"
                    src={URL.createObjectURL(avatarFile)}
                    alt="Woman looking front"
                  />
                ) : (
                  <DefaultAvatar name={user.name || ""} />
                )}
                <div className="absolute bottom-3 right-3 hidden group-hover:flex items-center justify-center bg-black border border-white p-2 rounded-full shadow-lg cursor-pointer">
                  <UploadFileModal onUploadFile={handleUploadAvatar}>
                    <Upload className="w-5 h-5 text-white" />
                  </UploadFileModal>
                </div>
              </div>
            </div>
            <div className="flex flex-col my-2 justify-center items-center gap-1">
              <h2 className="font-semibold text-2xl">{user.name || "User"}</h2>
            </div>
            <div className="info-section bg-white dark:bg-black shadow-md border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
              <div className="info-item flex justify-between items-center py-2 border-b">
                <span className="info-label font-medium ">ID:</span>
                <span className="info-value">{user.name || "N/A"}</span>
              </div>
              <div className="info-item flex justify-between items-center py-2 border-b">
                <span className="info-label font-medium ">Email:</span>
                <span className="info-value">{user.email || "N/A"}</span>
              </div>
              <div className="info-item flex justify-between items-center py-2 border-b">
                <span className="info-label font-medium ">Status:</span>
                <span className="info-value">{user.email_verified ? "Verified" : "N/A"}</span>
              </div>
              <div className="info-item flex justify-between items-center py-2 border-b">
                <span className="info-label font-medium ">Role:</span>
                Admin
              </div>
            </div>
            <div className="flex justify-center items-center py-5 gap-4">
              <Button
                className="cancel-btn-color text-md"
                onClick={() => router.back()}
              >
                Back
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
    </div>
  );
}
