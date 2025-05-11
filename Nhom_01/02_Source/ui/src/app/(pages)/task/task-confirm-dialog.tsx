"use client";

import { confirmTaskStatus } from "@/api/task.api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { getNextTaskStatus, TaskStatus, TaskType } from "@/type_schema/task";
import { formatDate } from "date-fns";
import { ArrowRight, Briefcase, Calendar, CheckCircle2, DollarSign, FileText, RefreshCcwDot, User } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

export function TaskConfirmDialog({
  children,
  targetTask,
  fetchTasks
}: {
  children: React.ReactNode;
  targetTask: TaskType;
  fetchTasks: () => void;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const nextStatus = getNextTaskStatus(targetTask.status);

  // Status badge styling
  const getStatusBadge = (status: string) => {
    if (!status || status === "") {
      return (
        <Badge
          variant="outline"
          className="bg-gray-500 text-white"
        >
          N/A
        </Badge>
      );
    }
    switch (status) {
      case TaskStatus.DONE:
        return (
          <Badge
            variant="outline"
            className="bg-green-500 text-green-50"
          >
            Done
          </Badge>
        );
      case TaskStatus.PROCESSING:
        return (
          <Badge
            variant="outline"
            className="bg-main text-white"
          >
            Processing
          </Badge>
        );
      case TaskStatus.DOING:
        return (
          <Badge
            variant="outline"
            className="bg-yellow-500 text-yellow-50"
          >
            Doing
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-500 text-gray-50"
          >
            N/A
          </Badge>
        );
    }
  };

  const handleConfirm = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const payload = {
        status: nextStatus
      };
      const response = await confirmTaskStatus(payload, targetTask.id);

      if (response == 201 || response == 200) {
        toast("Success", {
          description: "Update task status successfully",
          duration: 2000,
          className: "!bg-lime-500 !text-white"
        });
        fetchTasks();
        setOpen(false);
      } else {
        toast("Failed", {
          description: "Failed to update task status. Please try again!",
          duration: 2000,
          className: "!bg-red-500 !text-white"
        });
      }
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-semibold">Update Task Status</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Review task details and confirm status change
          </DialogDescription>
        </DialogHeader>

        {/* Task Info Section */}
        <div className="px-3">
          <Card className="border border-gray-100 shadow-sm">
            <CardContent className="px-6">
              <div className="space-y-6">
                {/* Task title and description */}
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">{targetTask.title}</h3>
                  <p className="text-sm text-muted-foreground">{targetTask.description}</p>
                </div>

                {/* Task details grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Activity and Project */}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm font-medium">
                      <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                      Activity & Project
                    </div>
                    <div className="pl-6 space-y-1">
                      <div className="text-sm">
                        <span className="font-medium">Activity:</span> {targetTask.activity.name}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Project:</span> {targetTask.activity.project.name}
                      </div>
                      {targetTask.activity.project.customer_id && (
                        <div className="text-sm">
                          <span className="font-medium">Project #:</span> {targetTask.activity.project.project_number}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm font-medium">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      Dates
                    </div>
                    <div className="pl-6 space-y-1">
                      <div className="text-sm">
                        <span className="font-medium">Deadline:</span> {formatDate(targetTask.deadline, "dd/MM/yyyy")}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Created:</span> {formatDate(targetTask.created_at, "dd/MM/yyyy")}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Updated:</span> {formatDate(targetTask.updated_at, "dd/MM/yyyy")}
                      </div>
                    </div>
                  </div>

                  {/* User */}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm font-medium">
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      Assigned User
                    </div>
                    <div className="pl-6 flex items-center space-x-2">
                      {targetTask.user.picture ? (
                        <img
                          src={targetTask.user.picture || "/placeholder.svg"}
                          alt={targetTask.user.name}
                          className="h-6 w-6 rounded-full"
                        />
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-3 w-3 text-gray-500" />
                        </div>
                      )}
                      <span className="text-sm">{targetTask.user.name}</span>
                    </div>
                  </div>

                  {/* Billable Status */}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm font-medium">
                      <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                      Billing Status
                    </div>
                    <div className="pl-6">
                      <Badge
                        variant={targetTask.billable ? "default" : "outline"}
                        className={targetTask.billable ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                      >
                        {targetTask.billable ? "Billable" : "Non-billable"}
                      </Badge>
                    </div>
                  </div>

                  {/* Expense Info (if available) */}
                  {targetTask.expense && (
                    <div className="space-y-2 md:col-span-2">
                      <div className="flex items-center text-sm font-medium">
                        <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                        Expense Details
                      </div>
                      <div className="pl-6 grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="text-sm">
                          <span className="font-medium">Name:</span> {targetTask.expense.name}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Category:</span> {targetTask.expense?.category?.name}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Confirm Task Status Section */}
        <div className="px-6 space-y-4">
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 items-center justify-center">
            <div className="flex items-center">{getStatusBadge(targetTask.status)}</div>
            <div className="flex items-center">
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex items-center">{getStatusBadge(nextStatus)}</div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 text-sm">
            <p className="text-center text-muted-foreground">
              Are you sure you want to change the status of this task? This action will update the task's progress
              tracking.
            </p>
          </div>
        </div>

        <DialogFooter className="px-6 pb-6">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className="bg-main text-white"
          >
            {loading ? (
              <span className="flex items-center">
                <RefreshCcwDot className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center cursor-pointer">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Confirm Status Change
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
