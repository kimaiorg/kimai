"use client";

"use client";

import type React from "react";

import { useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InvoiceTemplate } from "@/type_schema/invoice";

export default function InvoiceTemplateViewDialog({
  children,
  invoiceTemplate
}: {
  children: React.ReactNode;
  invoiceTemplate: InvoiceTemplate;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-200">
          <DialogHeader className="space-y-4 pt-3">
            <DialogTitle>Invoice Template info</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
