"use client";

import { requestUpdateTaskExpense } from "@/api/task.api";
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { CommonRequestType, RequestTypeType } from "@/type_schema/request";
import { TaskExpenseUpdateRequestType, TaskType } from "@/type_schema/task";
import { formatDate } from "date-fns";
import { Briefcase, Calendar, DollarSign, FileText, RefreshCcwDot, SendHorizonal, User } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

export function TaskUpdateExpenseRequestDialog({
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

  const [reasonInput, setReasonInput] = useState<string>("I want to change the task expense");
  const [quantity, setQuantity] = useState<string>("");

  const handleMakingATaskRequest = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const payload: CommonRequestType<TaskExpenseUpdateRequestType> = {
        comment: reasonInput,
        target_id: targetTask.id,
        team_id: targetTask.activity.team.id,
        type: RequestTypeType.CHANGE_EXPENSE_QUANTITY,
        request_data: {
          quantity: Number(quantity)
        }
      };
      const response = await requestUpdateTaskExpense(payload);

      if (response == 201 || response == 200) {
        toast("Success", {
          description: "Request task update successfully",
          duration: 2000,
          className: "!bg-lime-500 !text-white"
        });
        fetchTasks();
        setOpen(false);
      } else {
        toast("Failed", {
          description: "Failed to request task update. Please try again!",
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
          <DialogTitle className="text-xl font-semibold">Task request</DialogTitle>
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 border rounded-lg px-3 py-1 bg-muted/20">
              <p className="text-xs text-muted-foreground">Old Quantity</p>
              <p className="font-medium">{targetTask.quantity}</p>
            </div>
            <div className="space-y-1 border rounded-lg px-3 py-1 bg-muted/20">
              <p className="text-xs text-muted-foreground">New Quantity</p>
              <Input
                type="number"
                className="border-2 border-gray-200"
                value={quantity}
                min={1}
                step={1}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter new quantity"
              />
            </div>
          </div>
          <div className="pb-2">
            <p className="text-sm font-medium pb-1">Reason:</p>
            <Textarea
              rows={1}
              placeholder="Enter your reason"
              className="border border-gray-200"
              value={reasonInput}
              onChange={(e) => setReasonInput(e.target.value)}
            />
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
            onClick={handleMakingATaskRequest}
            disabled={loading}
            className="bg-main text-white"
          >
            {loading ? (
              <span className="flex items-center">
                <RefreshCcwDot className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center cursor-pointer gap-2">
                Request
                <SendHorizonal className="h-4 w-4" />
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
