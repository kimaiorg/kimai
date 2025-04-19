"use client";

"use client";

import type React from "react";

import { useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { ExpenseType } from "@/type_schema/expense";

export default function ExpenseViewDialog({ children, expense }: { children: React.ReactNode; expense: ExpenseType }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-200">
          <DialogHeader className="space-y-4 pt-3"> </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
