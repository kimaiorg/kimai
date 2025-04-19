"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CategoryType } from "@/type_schema/category";
import { useState } from "react";

export default function CategoryViewDialog({
  children,
  category
}: {
  children: React.ReactNode;
  category: CategoryType;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
          <DialogHeader>
            <DialogTitle>Category info</DialogTitle>
          </DialogHeader>
          {/* <DialogDescription>Task info section</DialogDescription> */}
        </DialogContent>
      </Dialog>
    </>
  );
}
