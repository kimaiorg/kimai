"use client";

import { InvoicePDFPreview } from "@/components/invoice/templates/invoice-pdf-preview";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { InvoiceHistoryType } from "@/type_schema/invoice";
import { useState } from "react";

export default function InvoicePreviewDialog({
  children,
  invoice
}: {
  children: React.ReactNode;
  invoice: InvoiceHistoryType;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="w-[90vw] h-[90vh] overflow-y-auto border border-gray-200 !block space-y-1">
          <DialogHeader>
            <DialogTitle>Preview</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {invoice && <InvoicePDFPreview invoice={invoice} />}
          {!invoice && (
            <div className="h-full flex items-center justify-center">
              <p className="text-center">No invoice found</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
