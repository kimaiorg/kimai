"use client";

import type React from "react";

import { format, formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  Calendar,
  CalendarClock,
  CheckCheck,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Clock,
  DollarSign,
  FileText,
  History,
  Mail,
  MessageSquare,
  Tag,
  Trash2,
  User,
  UserCircle2
} from "lucide-react";
import { useState } from "react";

import { confirmUpdateTask, rejectUpdateTask } from "@/api/request.api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApprovalStatus, RequestUpdateType } from "@/type_schema/request";
import { TaskExpenseUpdateRequestType, TaskResponseType, TaskUpdateStatusRequestType } from "@/type_schema/task";
import { toast } from "sonner";
import { useAppSelector } from "@/lib/redux-toolkit/hooks";
import { Role, RolePermissionType } from "@/type_schema/role";
import { useUser } from "@auth0/nextjs-auth0/client";
import { hasRole } from "@/components/shared/authenticated-route";

export default function TaskExpenseUpdateRequestDialog({
  children,
  taskExpense,
  fetchTaskExpenses
}: {
  children: React.ReactNode;
  taskExpense: RequestUpdateType<TaskResponseType, TaskExpenseUpdateRequestType>;
  fetchTaskExpenses: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const userRolePermissions = useAppSelector((state) => state.userState.privilege) as RolePermissionType;
  const allowRoles = [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD];
  // const [commentMessage, setCommentMessage] = useState("");

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch (error) {
      return dateString;
    }
  };

  // Format short date
  const formatShortDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  // Format time
  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "h:mm a");
    } catch (error) {
      return "";
    }
  };

  // Format currency
  const formatCurrency = (amount: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Get currency from project's customer if available
  const currency = taskExpense.previous_data.expense.project?.customer?.currency || "USD";

  // Get initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  const getRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "";
    }
  };

  // Calculate task status
  const getTaskStatus = () => {
    if (taskExpense.status == ApprovalStatus.APPROVED) {
      return {
        status: "approved",
        label: "Approved",
        color: "bg-green-500",
        bgColor: "bg-green-50",
        textColor: "text-green-800",
        icon: <CheckCheck className="h-4 w-4" />
      };
    }

    if (taskExpense.status == ApprovalStatus.REJECTED) {
      return {
        status: "rejected",
        label: "Rejected",
        color: "bg-main",
        bgColor: "bg-violet-50",
        textColor: "text-violet-800",
        icon: <Clock className="h-4 w-4" />
      };
    }

    return {
      status: "processing",
      label: "Processing",
      color: "bg-main",
      bgColor: "bg-violet-50",
      textColor: "text-violet-800",
      icon: <Clock className="h-4 w-4" />
    };
  };

  const taskStatus = getTaskStatus();

  const taskExpenseUpdateInfo = {
    oldQuantity: taskExpense.previous_data.quantity,
    oldPrice: taskExpense.previous_data.expense.cost * taskExpense.previous_data.quantity,
    newQuantity: taskExpense.request_data.quantity,
    newPrice: taskExpense.previous_data.expense.cost * taskExpense.request_data.quantity
  };

  const handleRejectTaskExpense = async () => {
    if (rejectLoading) return;
    setRejectLoading(true);
    try {
      const payload: TaskUpdateStatusRequestType = {
        status: ApprovalStatus.REJECTED
      };
      const response = await rejectUpdateTask(payload, taskExpense.id.toString());

      if (response == 201 || response == 200 || response == 204) {
        toast("Success", {
          description: "Reject task update successfully",
          duration: 2000,
          className: "!bg-lime-500 !text-white"
        });
        fetchTaskExpenses();
        setOpen(false);
      } else {
        toast("Failed", {
          description: "Failed to reject update task. Please try again!",
          duration: 2000,
          className: "!bg-red-500 !text-white"
        });
      }
    } catch (error: unknown) {
      toast("Failed", {
        description: "Failed to update task. Please try again!",
        duration: 2000,
        className: "!bg-red-500 !text-white"
      });
    } finally {
      setRejectLoading(false);
    }
  };

  const handleConfirmTaskExpense = async () => {
    if (confirmLoading) return;
    setConfirmLoading(true);
    try {
      const payload: TaskUpdateStatusRequestType = {
        status: ApprovalStatus.APPROVED
      };
      const response = await confirmUpdateTask(payload, taskExpense.id.toString());

      if (response == 201 || response == 200) {
        toast("Success", {
          description: "Confirm task update successfully",
          duration: 2000,
          className: "!bg-lime-500 !text-white"
        });
        fetchTaskExpenses();
        setOpen(false);
      } else {
        toast("Failed", {
          description: "Failed to confirm update task. Please try again!",
          duration: 2000,
          className: "!bg-red-500 !text-white"
        });
      }
    } catch (error: unknown) {
      toast("Failed", {
        description: "Failed to confirm update task. Please try again!",
        duration: 2000,
        className: "!bg-red-500 !text-white"
      });
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-200">
          <DialogHeader className="space-y-4 pt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-md flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: taskExpense.previous_data.activity?.color || "#64748b" }}
                >
                  <ClipboardCheck className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold">{taskExpense.previous_data.title}</DialogTitle>
                  <div className="text-sm text-muted-foreground mt-1">
                    Task #{taskExpense.previous_data.id} • Activity:{" "}
                    {taskExpense.previous_data.activity?.name || "Unknown"}
                  </div>
                </div>
              </div>
              <Badge
                className={`px-3 py-1.5 text-sm flex items-center gap-1.5 ${taskStatus.bgColor} ${taskStatus.textColor}`}
              >
                {taskStatus.icon}
                {taskStatus.label}
              </Badge>
            </div>
          </DialogHeader>

          {/* Display task quantity update info and Confirm update button section */}
          {hasRole(userRolePermissions.role, allowRoles) && taskExpense.status == ApprovalStatus.PROCESSING && (
            <div className="border-t border-b py-2 space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 border rounded-lg px-3 py-1 bg-muted/20">
                  <p className="text-xs text-muted-foreground">Old Quantity</p>
                  <p className="font-medium">{taskExpenseUpdateInfo.oldQuantity}</p>
                </div>
                <div className="space-y-1 border rounded-lg px-3 py-1 bg-muted/20">
                  <p className="text-xs text-muted-foreground">Old Price</p>
                  <p className="font-medium">{formatCurrency(taskExpenseUpdateInfo.oldPrice, currency)}</p>
                </div>
                <div className="space-y-1 border rounded-lg px-3 py-1 bg-muted/20">
                  <p className="text-xs text-muted-foreground">New Quantity</p>
                  <p className="font-medium">{taskExpenseUpdateInfo.newQuantity}</p>
                </div>
                <div className="space-y-1 border rounded-lg px-3 py-1 bg-muted/20">
                  <p className="text-xs text-muted-foreground">New Price</p>
                  <p className="font-medium">{formatCurrency(taskExpenseUpdateInfo.newPrice, currency)}</p>
                </div>
              </div>
              {/* <div className="py-2">
                <Textarea
                  rows={1}
                  placeholder="Enter your message"
                  className="border border-gray-200"
                  value={commentMessage}
                  onChange={(e) => setCommentMessage(e.target.value)}
                />
              </div> */}
              <div className="flex justify-end gap-4">
                <Button
                  onClick={handleRejectTaskExpense}
                  className="bg-rose-500 hover:bg-rose-600 text-white cursor-pointer"
                >
                  Reject
                </Button>
                <Button
                  className="bg-main text-white cursor-pointer"
                  onClick={handleConfirmTaskExpense}
                >
                  Confirm
                </Button>
              </div>
            </div>
          )}
          {/* Display task quantity update info and Confirm update button section */}

          <Tabs
            defaultValue="task"
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="task">Task info</TabsTrigger>
              <TabsTrigger value="expense">Expense info</TabsTrigger>
            </TabsList>

            <TabsContent
              value="task"
              className="space-y-6 pt-6"
            >
              {taskExpense.previous_data.description && (
                <Card className="border border-gray-200 !gap-3">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <p>{taskExpense.previous_data.description}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border border-gray-200 !gap-3">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <CalendarClock className="h-4 w-4" />
                      Deadline Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {taskExpense.previous_data.deadline ? (
                      <div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Due Date</p>
                            <p className="text-2xl font-bold mt-1">{formatDate(taskExpense.previous_data.deadline)}</p>
                          </div>
                          <div
                            className={`h-16 w-16 rounded-full border-4 flex items-center justify-center ${taskStatus.status === "overdue" ? "border-red-500" : "border-amber-500"}`}
                          >
                            <Clock
                              className={`h-6 w-6 ${taskStatus.status === "overdue" ? "text-red-500" : "text-amber-500"}`}
                            />
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm text-muted-foreground">Time Remaining</p>
                          <p className="font-medium mt-1">
                            {taskExpense.previous_data.deleted_at ? (
                              <span className="text-green-600 flex items-center gap-1.5">
                                <CheckCircle2 className="h-4 w-4" />
                                Completed {getRelativeTime(taskExpense.previous_data.deleted_at)}
                              </span>
                            ) : taskStatus.status === "overdue" ? (
                              <span className="text-red-600 flex items-center gap-1.5">
                                <AlertCircle className="h-4 w-4" />
                                Overdue by {getRelativeTime(taskExpense.previous_data.deadline).replace("ago", "")}
                              </span>
                            ) : (
                              <span>Due {getRelativeTime(taskExpense.previous_data.deadline)}</span>
                            )}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 text-center">
                        <Clock className="h-10 w-10 text-muted-foreground mb-2" />
                        <h3 className="text-lg font-medium">No Deadline Set</h3>
                        <p className="text-muted-foreground">This task doesn't have a deadline.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 !gap-3">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Assigned To
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {taskExpense.previous_data.user ? (
                      <div className="flex flex-col items-center text-center">
                        <Avatar
                          className="h-20 w-20 border-2 mb-4"
                          style={{ borderColor: taskExpense.previous_data.activity?.color || "#e2e8f0" }}
                        >
                          {taskExpense.previous_data.user.picture ? (
                            <AvatarImage
                              src={taskExpense.previous_data.user.picture}
                              alt={taskExpense.previous_data.user.name}
                            />
                          ) : (
                            <AvatarFallback
                              className="text-xl font-medium"
                              style={{ backgroundColor: taskExpense.previous_data.activity?.color || "#f1f5f9" }}
                            >
                              {getInitials(taskExpense.previous_data.user.name)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <h3 className="text-xl font-bold">{taskExpense.previous_data.user.name}</h3>
                        <p className="text-muted-foreground">
                          {taskExpense.previous_data.user.nickname || taskExpense.previous_data.user.email}
                        </p>

                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5"
                          >
                            <Mail className="h-4 w-4" />
                            Email
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5"
                          >
                            <MessageSquare className="h-4 w-4" />
                            Message
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 text-center">
                        <UserCircle2 className="h-10 w-10 text-muted-foreground mb-2" />
                        <h3 className="text-lg font-medium">No User Assigned</h3>
                        <p className="text-muted-foreground">This task doesn't have an assigned user.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card className="border border-gray-200 !gap-3">
                <CardHeader className="pb-0">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <History className="h-4 w-4" />
                    Task Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center ${taskStatus.bgColor}`}
                        >
                          {taskStatus.icon}
                        </div>
                        <div>
                          <p className="font-medium">{taskStatus.label}</p>
                          <p className="text-sm text-muted-foreground">
                            {taskExpense.previous_data.deleted_at ? (
                              <>Completed on {formatShortDate(taskExpense.previous_data.deleted_at)}</>
                            ) : taskExpense.previous_data.deadline ? (
                              <>Due on {formatShortDate(taskExpense.previous_data.deadline)}</>
                            ) : (
                              <>No deadline set</>
                            )}
                          </p>
                        </div>
                      </div>

                      {!taskExpense.previous_data.deleted_at && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Mark as Complete
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1 border rounded-lg p-3 bg-muted/20">
                        <p className="text-xs text-muted-foreground">Created</p>
                        <p className="font-medium">{formatShortDate(taskExpense.previous_data.created_at)}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatTime(taskExpense.previous_data.created_at)}
                        </p>
                      </div>
                      <div className="space-y-1 border rounded-lg p-3 bg-muted/20">
                        <p className="text-xs text-muted-foreground">Last Updated</p>
                        <p className="font-medium">{formatShortDate(taskExpense.previous_data.updated_at)}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatTime(taskExpense.previous_data.updated_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value="expense"
              className="space-y-6 pt-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Expense Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1 border rounded-lg p-3 bg-muted/20">
                      <p className="text-xs text-muted-foreground">Unit Cost</p>
                      <p className="font-medium">{formatCurrency(taskExpense.previous_data.expense.cost, currency)}</p>
                    </div>
                    <div className="space-y-1 border rounded-lg p-3 bg-muted/20">
                      <p className="text-xs text-muted-foreground">Created</p>
                      <p className="font-medium">{formatShortDate(taskExpense.previous_data.expense.created_at)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Category
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {taskExpense.previous_data.expense.category ? (
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-md flex items-center justify-center text-white"
                          style={{ backgroundColor: taskExpense.previous_data.expense.category.color || "#64748b" }}
                        >
                          <Tag className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">{taskExpense.previous_data.expense.category.name}</h3>
                          {taskExpense.previous_data.expense.category.description && (
                            <p className="text-muted-foreground">
                              {taskExpense.previous_data.expense.category.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 text-center">
                        <Tag className="h-10 w-10 text-muted-foreground mb-2" />
                        <h3 className="text-lg font-medium">No Category</h3>
                        <p className="text-muted-foreground">This expense doesn't have a category assigned.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Created</p>
                          <p className="font-medium">
                            {formatDate(taskExpense.previous_data.expense.created_at)} at{" "}
                            {formatTime(taskExpense.previous_data.expense.created_at)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Last Updated</p>
                          <p className="font-medium">
                            {formatDate(taskExpense.previous_data.expense.updated_at)} at{" "}
                            {formatTime(taskExpense.previous_data.expense.updated_at)}
                          </p>
                        </div>
                      </div>

                      {taskExpense.previous_data.expense.deleted_at && (
                        <div className="flex items-start gap-3">
                          <Trash2 className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Deleted</p>
                            <p className="font-medium text-red-500">
                              {formatDate(taskExpense.previous_data.expense.deleted_at)} at{" "}
                              {formatTime(taskExpense.previous_data.expense.deleted_at)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {taskExpense.previous_data.expense.task && taskExpense.previous_data.expense.task.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <ClipboardList className="h-4 w-4" />
                      Associated Tasks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {taskExpense.previous_data.expense.task.slice(0, 3).map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between border rounded-lg p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-md flex items-center justify-center text-white"
                              style={{
                                backgroundColor: taskExpense.previous_data.expense.activity?.color || "#64748b"
                              }}
                            >
                              <ClipboardList className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium">{task.title}</p>
                              <p className="text-xs text-muted-foreground">Task #{task.id}</p>
                            </div>
                          </div>
                          <Badge
                            variant={task.deleted_at ? "secondary" : "outline"}
                            className={task.deleted_at ? "bg-green-100 text-green-800" : ""}
                          >
                            {task.deleted_at ? "Completed" : task.status || "Active"}
                          </Badge>
                        </div>
                      ))}

                      {taskExpense.previous_data.expense.task.length > 3 && (
                        <div className="text-center mt-2">
                          <Button
                            variant="link"
                            size="sm"
                          >
                            View all {taskExpense.previous_data.expense.task.length} tasks
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
