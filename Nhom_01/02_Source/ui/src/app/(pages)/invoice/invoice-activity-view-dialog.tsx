"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InvoiceHistoryItemType } from "@/type_schema/invoice";
import { useState } from "react";

export default function InvoiceActivityViewDialog({
  children,
  invoiceActivity
}: {
  children: React.ReactNode;
  invoiceActivity: InvoiceHistoryItemType;
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
          </DialogHeader>

          {!invoiceActivity && (
            <div className="h-full flex items-center justify-center">
              <p className="text-center">No invoice found</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
