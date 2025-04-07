"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Timesheet } from "@/type_schema/timesheet";

interface TimesheetCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTimesheet: (timesheetData: any) => void;
  isEditing?: boolean;
  initialData?: Partial<Timesheet>;
}

export function TimesheetCreateDialog({
  open,
  onOpenChange,
  onCreateTimesheet,
  isEditing = false,
  initialData = {}
}: TimesheetCreateDialogProps) {
  const [formData, setFormData] = useState({
    description: initialData.description || "",
    project: initialData.project || "",
    activity: initialData.activity || "",
    start_time: initialData.start_time
      ? new Date(initialData.start_time).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
    end_time: initialData.end_time ? new Date(initialData.end_time).toISOString().slice(0, 16) : "",
    billable: initialData.billable || false,
    tags: initialData.tags?.join(", ") || ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: target.checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert form data to the correct types
    const timesheetData = {
      ...formData,
      start_time: new Date(formData.start_time),
      end_time: formData.end_time ? new Date(formData.end_time) : undefined,
      tags: formData.tags ? formData.tags.split(",").map((tag) => tag.trim()) : [],
      billable: Boolean(formData.billable)
    };

    onCreateTimesheet(timesheetData);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Timesheet" : "Create Timesheet"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Edit your timesheet details below." : "Fill in the details to create a new timesheet entry."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="description"
                className="text-right"
              >
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter description"
                className="col-span-3"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="project"
                className="text-right"
              >
                Project
              </Label>
              <Input
                id="project"
                name="project"
                placeholder="Select project"
                className="col-span-3"
                value={formData.project}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="activity"
                className="text-right"
              >
                Activity
              </Label>
              <Input
                id="activity"
                name="activity"
                placeholder="Select activity"
                className="col-span-3"
                value={formData.activity}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="start_time"
                className="text-right"
              >
                Start Time
              </Label>
              <Input
                id="start_time"
                name="start_time"
                type="datetime-local"
                className="col-span-3"
                value={formData.start_time}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="end_time"
                className="text-right"
              >
                End Time
              </Label>
              <Input
                id="end_time"
                name="end_time"
                type="datetime-local"
                className="col-span-3"
                value={formData.end_time}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="tags"
                className="text-right"
              >
                Tags
              </Label>
              <Input
                id="tags"
                name="tags"
                placeholder="Enter tags (comma separated)"
                className="col-span-3"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="billable"
                className="text-right"
              >
                Billable
              </Label>
              <div className="col-span-3 flex items-center">
                <Input
                  id="billable"
                  name="billable"
                  type="checkbox"
                  className="h-4 w-4"
                  checked={Boolean(formData.billable)}
                  onChange={handleChange}
                />
                <Label
                  htmlFor="billable"
                  className="ml-2"
                >
                  Mark as billable
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{isEditing ? "Save Changes" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
