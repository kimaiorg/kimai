"use client";

"use client";

import type React from "react";

import { useState } from "react";
import { format, formatDistanceToNow, isAfter, isBefore, parseISO } from "date-fns";
import {
  Activity,
  AlertCircle,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  ClipboardCheck,
  ClipboardList,
  FileText,
  Mail,
  MessageSquare,
  User,
  UserCircle2,
  CalendarClock,
  CheckCheck,
  XCircle,
  History
} from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { TaskType } from "@/type_schema/task";

export default function TaskViewDialog({ children, task }: { children: React.ReactNode; task: TaskType }) {
  const [open, setOpen] = useState(false);

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

  // Get relative time
  const getRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "";
    }
  };

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

  // Calculate task status
  const getTaskStatus = () => {
    if (task.deleted_at) {
      return {
        status: "completed",
        label: "Completed",
        color: "bg-green-500",
        bgColor: "bg-green-50",
        textColor: "text-green-800",
        icon: <CheckCheck className="h-4 w-4" />
      };
    }

    if (!task.deadline) {
      return {
        status: "no-deadline",
        label: "No Deadline",
        color: "bg-gray-500",
        bgColor: "bg-gray-50",
        textColor: "text-gray-800",
        icon: <Clock className="h-4 w-4" />
      };
    }

    const now = new Date();
    const deadlineDate = parseISO(task.deadline);

    if (isAfter(now, deadlineDate)) {
      return {
        status: "overdue",
        label: "Overdue",
        color: "bg-red-500",
        bgColor: "bg-red-50",
        textColor: "text-red-800",
        icon: <AlertCircle className="h-4 w-4" />
      };
    }

    // If deadline is within 2 days
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(now.getDate() + 2);

    if (isBefore(deadlineDate, twoDaysFromNow)) {
      return {
        status: "soon",
        label: "Due Soon",
        color: "bg-amber-500",
        bgColor: "bg-amber-50",
        textColor: "text-amber-800",
        icon: <Clock className="h-4 w-4" />
      };
    }

    return {
      status: "upcoming",
      label: "Upcoming",
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
      icon: <Calendar className="h-4 w-4" />
    };
  };

  const taskStatus = getTaskStatus();

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
                  style={{ backgroundColor: task.activity?.color || "#64748b" }}
                >
                  <ClipboardCheck className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold">{task.title}</DialogTitle>
                  <div className="text-sm text-muted-foreground mt-1">
                    Task #{task.id} • Activity: {task.activity?.name || "Unknown"}
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

          <Tabs
            defaultValue="details"
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="details"
                className="cursor-pointer"
              >
                Details
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="cursor-pointer"
              >
                Activity
              </TabsTrigger>
              <TabsTrigger
                value="timeline"
                className="cursor-pointer"
              >
                Timeline
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="details"
              className="space-y-6 pt-6"
            >
              {task.description && (
                <Card className="border border-gray-200 !gap-3">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <p>{task.description}</p>
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
                    {task.deadline ? (
                      <div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Due Date</p>
                            <p className="text-2xl font-bold mt-1">{formatDate(task.deadline)}</p>
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
                            {task.deleted_at ? (
                              <span className="text-green-600 flex items-center gap-1.5">
                                <CheckCircle2 className="h-4 w-4" />
                                Completed {getRelativeTime(task.deleted_at)}
                              </span>
                            ) : taskStatus.status === "overdue" ? (
                              <span className="text-red-600 flex items-center gap-1.5">
                                <AlertCircle className="h-4 w-4" />
                                Overdue by {getRelativeTime(task.deadline).replace("ago", "")}
                              </span>
                            ) : (
                              <span>Due {getRelativeTime(task.deadline)}</span>
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
                    {task.user ? (
                      <div className="flex flex-col items-center text-center">
                        <Avatar
                          className="h-20 w-20 border-2 mb-4"
                          style={{ borderColor: task.activity?.color || "#e2e8f0" }}
                        >
                          {task.user.picture ? (
                            <AvatarImage
                              src={task.user.picture}
                              alt={task.user.name}
                            />
                          ) : (
                            <AvatarFallback
                              className="text-xl font-medium"
                              style={{ backgroundColor: task.activity?.color || "#f1f5f9" }}
                            >
                              {getInitials(task.user.name)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <h3 className="text-xl font-bold">{task.user.name}</h3>
                        <p className="text-muted-foreground">{task.user.nickname || task.user.email}</p>

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
                            {task.deleted_at ? (
                              <>Completed on {formatShortDate(task.deleted_at)}</>
                            ) : task.deadline ? (
                              <>Due on {formatShortDate(task.deadline)}</>
                            ) : (
                              <>No deadline set</>
                            )}
                          </p>
                        </div>
                      </div>

                      {!task.deleted_at && (
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
                        <p className="font-medium">{formatShortDate(task.created_at)}</p>
                        <p className="text-xs text-muted-foreground">{formatTime(task.created_at)}</p>
                      </div>
                      <div className="space-y-1 border rounded-lg p-3 bg-muted/20">
                        <p className="text-xs text-muted-foreground">Last Updated</p>
                        <p className="font-medium">{formatShortDate(task.updated_at)}</p>
                        <p className="text-xs text-muted-foreground">{formatTime(task.updated_at)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value="activity"
              className="space-y-6 pt-6"
            >
              {task.activity ? (
                <>
                  <Card className="border border-gray-200 !gap-3">
                    <CardHeader className="pb-0">
                      <CardTitle className="text-base font-medium flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Activity Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-10 h-10 rounded-md flex items-center justify-center text-white font-bold text-lg"
                          style={{ backgroundColor: task.activity.color || "#64748b" }}
                        >
                          <Activity className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{task.activity.name}</h4>
                          <p className="text-sm text-muted-foreground">Activity #{task.activity.activity_number}</p>
                        </div>
                        <Badge
                          className="ml-auto px-3 py-1"
                          style={{
                            backgroundColor: `${task.activity.color}20` || "#f1f5f9",
                            color: task.activity.color || "inherit"
                          }}
                        >
                          {task.activity.tasks?.length || 0} Tasks
                        </Badge>
                      </div>

                      {task.activity.description && (
                        <div className="mt-4 mb-6">
                          <p className="text-sm text-muted-foreground">{task.activity.description}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1 border rounded-lg p-3 bg-muted/20">
                          <p className="text-xs text-muted-foreground">Budget</p>
                          <p className="font-medium">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                              maximumFractionDigits: 0
                            }).format(task.activity.budget)}
                          </p>
                        </div>
                        <div className="space-y-1 border rounded-lg p-3 bg-muted/20">
                          <p className="text-xs text-muted-foreground">Created</p>
                          <p className="font-medium">{formatShortDate(task.activity.created_at)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {task.activity.project && (
                    <Card className="border border-gray-200 !gap-3">
                      <CardHeader className="pb-0">
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          Project Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-md flex items-center justify-center text-white font-bold text-lg"
                            style={{ backgroundColor: task.activity.project.color || "#64748b" }}
                          >
                            {task.activity.project.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-semibold">{task.activity.project.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Project #{task.activity.project.project_number}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div className="space-y-1 border rounded-lg p-3 bg-muted/20">
                            <p className="text-xs text-muted-foreground">Timeline</p>
                            <p className="font-medium">
                              {formatShortDate(task.activity.project.start_date)} -{" "}
                              {formatShortDate(task.activity.project.end_date)}
                            </p>
                          </div>
                          <div className="space-y-1 border rounded-lg p-3 bg-muted/20">
                            <p className="text-xs text-muted-foreground">Budget</p>
                            <p className="font-medium">
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                                maximumFractionDigits: 0
                              }).format(task.activity.project.budget)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {task.activity.team && (
                    <Card className="border border-gray-200 !gap-3">
                      <CardHeader className="pb-0">
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Team Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-md flex items-center justify-center text-white font-bold text-lg"
                            style={{ backgroundColor: task.activity.team.color || "#64748b" }}
                          >
                            {task.activity.team.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-semibold">{task.activity.team.name}</h4>
                            <p className="text-sm text-muted-foreground">ID: {task.activity.team.id}</p>
                          </div>
                          <Badge
                            variant="outline"
                            className="ml-auto px-3 py-1"
                          >
                            {task.activity.team.users?.length || 0} Members
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/20">
                  <Activity className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No Activity Information</h3>
                  <p className="text-muted-foreground">This task is not associated with any activity.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent
              value="timeline"
              className="space-y-6 pt-6"
            >
              <Card className="border border-gray-200 !gap-3">
                <CardHeader className="pb-0">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <History className="h-4 w-4" />
                    Task Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start gap-3 border-l-2 border-green-500 pl-4 py-1">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <ClipboardList className="h-3.5 w-3.5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Task Created</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(task.created_at)} at {formatTime(task.created_at)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{getRelativeTime(task.created_at)}</p>
                      </div>
                    </div>

                    {task.created_at !== task.updated_at && (
                      <div className="flex items-start gap-3 border-l-2 border-blue-500 pl-4 py-1">
                        <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                          <FileText className="h-3.5 w-3.5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Task Updated</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(task.updated_at)} at {formatTime(task.updated_at)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{getRelativeTime(task.updated_at)}</p>
                        </div>
                      </div>
                    )}

                    {task.deadline && (
                      <div className="flex items-start gap-3 border-l-2 border-amber-500 pl-4 py-1">
                        <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center mt-0.5">
                          <Calendar className="h-3.5 w-3.5 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-medium">Deadline Set</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(task.deadline)} at {formatTime(task.deadline)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">Due {getRelativeTime(task.deadline)}</p>
                        </div>
                      </div>
                    )}

                    {task.deleted_at && (
                      <div className="flex items-start gap-3 border-l-2 border-green-500 pl-4 py-1">
                        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                          <CheckCheck className="h-3.5 w-3.5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Task Completed</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(task.deleted_at)} at {formatTime(task.deleted_at)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{getRelativeTime(task.deleted_at)}</p>
                        </div>
                      </div>
                    )}

                    {!task.deleted_at && task.deadline && isAfter(new Date(), parseISO(task.deadline)) && (
                      <div className="flex items-start gap-3 border-l-2 border-red-500 pl-4 py-1">
                        <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                          <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">Deadline Passed</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(task.deadline)} at {formatTime(task.deadline)}
                          </p>
                          <p className="text-xs text-red-600 mt-1">
                            Overdue by {getRelativeTime(task.deadline).replace("ago", "")}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 !gap-3">
                <CardHeader className="pb-0">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Activity Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {task.activity ? (
                    <div className="space-y-6">
                      <div className="flex items-start gap-3 border-l-2 border-purple-500 pl-4 py-1">
                        <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                          <Activity className="h-3.5 w-3.5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">Activity Created</p>
                          <p className="text-sm text-muted-foreground">{formatDate(task.activity.created_at)}</p>
                        </div>
                      </div>

                      {task.activity.project && (
                        <>
                          <div className="flex items-start gap-3 border-l-2 border-blue-500 pl-4 py-1">
                            <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                              <Briefcase className="h-3.5 w-3.5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">Project Started</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(task.activity.project.start_date)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 border-l-2 border-indigo-500 pl-4 py-1">
                            <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center mt-0.5">
                              <Briefcase className="h-3.5 w-3.5 text-indigo-600" />
                            </div>
                            <div>
                              <p className="font-medium">Project End Date</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(task.activity.project.end_date)}
                              </p>
                            </div>
                          </div>
                        </>
                      )}

                      {task.activity.deleted_at && (
                        <div className="flex items-start gap-3 border-l-2 border-red-500 pl-4 py-1">
                          <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                            <XCircle className="h-3.5 w-3.5 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium">Activity Cancelled</p>
                            <p className="text-sm text-muted-foreground">{formatDate(task.activity.deleted_at)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">No activity timeline available</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
