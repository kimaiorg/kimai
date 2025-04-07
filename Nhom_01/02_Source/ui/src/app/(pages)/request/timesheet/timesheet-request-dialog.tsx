"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface AbsenceRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  absenceType: "holiday" | "timeoff" | "sickness" | "other";
}

export function TimesheetRequestDialog({ open, onOpenChange, absenceType }: AbsenceRequestDialogProps) {
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [comment, setComment] = useState("");

  const getTitle = () => {
    switch (absenceType) {
      case "holiday":
        return "Create: Holiday Request";
      case "timeoff":
        return "Create: Time Off Request";
      case "sickness":
        return "Create: Sickness";
      case "other":
        return "Create: Other Absence";
      default:
        return "Create: Absence Request";
    }
  };

  const handleSave = () => {
    // Handle save logic here
    console.log({
      type: absenceType,
      fromDate,
      toDate,
      comment
    });
    onOpenChange(false);
  };

  const clearToDate = () => {
    setToDate(undefined);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="border-b pb-3">
          <DialogTitle>{getTitle()}</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label
                htmlFor="from-date"
                className="flex items-center"
              >
                From <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="flex mt-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="from-date"
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !fromDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fromDate ? format(fromDate, "M/d/yyyy") : "M/D/YYYY"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={fromDate}
                      onSelect={setFromDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <Label htmlFor="to-date">To</Label>
              <div className="flex mt-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="to-date"
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !toDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {toDate ? format(toDate, "M/d/yyyy") : "M/D/YYYY"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={toDate}
                      onSelect={setToDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {toDate && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-1"
                    onClick={clearToDate}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="duration">Duration</Label>
              <div className="flex mt-1">
                <Button
                  id="duration"
                  variant="outline"
                  className="w-full justify-start text-left font-normal text-muted-foreground"
                  disabled
                >
                  <Clock className="mr-2 h-4 w-4" />
                  {fromDate && toDate
                    ? `${Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24))} days`
                    : ""}
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1"
              rows={4}
            />
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
