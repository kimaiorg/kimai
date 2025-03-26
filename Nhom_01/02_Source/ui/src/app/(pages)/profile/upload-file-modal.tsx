"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function UploadFileModal({
  children,
  onUploadFile
}: {
  children: React.ReactNode;
  onUploadFile: (file: File) => void;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [preview, setPreview] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFile: File[]) => {
    const latestFile = acceptedFile[0];
    setPreview(latestFile);
  }, []);
  const { getRootProps, getInputProps, isDragReject } = useDropzone({ onDrop });

  const handleResetPreview = () => {
    setPreview(null);
  };

  const handleUpdateFile = () => {
    if (!preview) return;
    onUploadFile(preview);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-white dark:bg-slate-800 overflow-y-auto py-3 rounded-lg w-[95vw] min-h-72">
        <DialogTitle>{preview ? "Preview" : "Upload File"}</DialogTitle>
        <div
          {...getRootProps()}
          className="h-fit outline-none"
        >
          {preview ? (
            <div className="flex items-center flex-col justify-center">
              <div className="h-60 border-4 border-white rounded-lg overflow-hidden">
                <img
                  className="object-cover object-center w-full h-full"
                  src={URL.createObjectURL(preview!)}
                  alt="Woman looking front"
                />
              </div>
              <div className="flex justify-center gap-3 pt-3">
                <Button
                  className="bg-rose-500 text-white cursor-pointer"
                  onClick={handleResetPreview}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-lime-500 text-white cursor-pointer"
                  onClick={handleUpdateFile}
                >
                  Update
                </Button>
              </div>
            </div>
          ) : (
            <div className="px-5">
              <input {...getInputProps()} />
              <label className="bg-white dark:bg-slate-800 text-gray-500 font-semibold text-base rounded max-w-md h-36 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto font-[sans-serif]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-11 mb-2 fill-gray-500"
                  viewBox="0 0 32 32"
                >
                  <path
                    d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                    data-original="#000000"
                  />
                  <path
                    d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                    data-original="#000000"
                  />
                </svg>
                Upload file
                <p className="text-xs font-medium text-gray-400 mt-2">PNG, JPG SVG, WEBP, and GIF are Allowed.</p>
              </label>
              {isDragReject && <p className="text-red-500 text-sm">*File type is not supported</p>}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
