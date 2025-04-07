"use client";

"use client";

import type React from "react";

import { useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { TimesheetTestType } from "@/type_schema/timesheet";

export default function TimesheetViewDialog({
  children,
  timesheet
}: {
  children: React.ReactNode;
  timesheet: TimesheetTestType;
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
          <DialogHeader className="space-y-4 pt-3">Timesheet info</DialogHeader>

          <div>Timesheet info section</div>
        </DialogContent>
      </Dialog>
    </>
  );
}
