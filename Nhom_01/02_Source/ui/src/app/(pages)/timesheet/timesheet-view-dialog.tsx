"use client";
"use client";

import type React from "react";

import { format } from "date-fns";
import {
  Activity,
  AlarmClock,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileText,
  Hourglass,
  Pause,
  Play,
  StopCircle,
  Timer,
  User,
  Users
} from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimesheetStatus, TimesheetType } from "@/type_schema/timesheet";

export default function TimesheetViewDialog({
  children,
  defaultOpen,
  timesheet
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
  timesheet: TimesheetType;
}) {
  const [open, setOpen] = useState(defaultOpen || false);

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "PPP");
    } catch (error) {
      return dateString;
    }
  };

  // Format time
  const formatTime = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "h:mm a");
    } catch (error) {
      return dateString;
    }
  };

  // Format date and time
  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "PPP 'at' h:mm a");
    } catch (error) {
      return dateString;
    }
  };

  // Format duration in hours and minutes
  const formatDurationHM = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours === 0) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    }

    return `${hours} hour${hours !== 1 ? "s" : ""} ${minutes} minute${minutes !== 1 ? "s" : ""}`;
  };

  // Calculate current duration for running timesheets
  const calculateCurrentDuration = () => {
    if (timesheet.status === TimesheetStatus.TRACKED || !timesheet.start_time) {
      return timesheet.duration;
    }

    const startTime = new Date(timesheet.start_time);
    const now = new Date();
    const durationInSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);

    return durationInSeconds;
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

  const currentDuration = calculateCurrentDuration();

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
                  className={`w-12 h-12 rounded-md flex items-center justify-center text-white font-bold text-xl ${
                    timesheet.status === "running" ? "bg-main" : "bg-sub"
                  }`}
                >
                  {timesheet.status === "running" ? (
                    <Timer className="h-6 w-6 animate-pulse" />
                  ) : (
                    <AlarmClock className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold">
                    {timesheet.task?.title || timesheet.activity?.name || timesheet.project?.name || "Timesheet"}
                  </DialogTitle>
                  <div className="text-sm text-muted-foreground mt-1">
                    Timesheet #{timesheet.id} • {formatDurationHM(currentDuration)}
                  </div>
                </div>
              </div>
              <Badge
                className={`px-3 py-1.5 text-sm flex items-center gap-1.5 ${
                  timesheet.status === "running" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                }`}
              >
                {timesheet.status === "running" ? (
                  <>
                    <Play className="h-4 w-4 fill-green-800" />
                    Running
                  </>
                ) : (
                  <>
                    <StopCircle className="h-4 w-4" />
                    Stopped
                  </>
                )}
              </Badge>
            </div>
          </DialogHeader>

          <Tabs
            defaultValue="overview"
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="overview"
                className="cursor-pointer"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="cursor-pointer"
              >
                Details
              </TabsTrigger>
              <TabsTrigger
                value="related"
                className="cursor-pointer"
              >
                Related Items
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="overview"
              className="space-y-6 pt-6"
            >
              <Card className="border border-gray-200 !gap-3">
                <CardHeader className="pb-0">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Time Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1 border rounded-lg p-3 bg-muted/20">
                      <p className="text-xs text-muted-foreground">Started</p>
                      <p className="font-medium">{formatDateTime(timesheet.start_time)}</p>
                    </div>
                    <div className="space-y-1 border rounded-lg p-3 bg-muted/20">
                      <p className="text-xs text-muted-foreground">Ended</p>
                      <p className="font-medium">
                        {timesheet.status === "running" ? (
                          <span className="text-green-500 flex items-center gap-1.5">
                            <Play className="h-3 w-3 fill-green-500" />
                            Still running
                          </span>
                        ) : (
                          formatDateTime(timesheet.end_time)
                        )}
                      </p>
                    </div>
                    <div className="space-y-1 border rounded-lg p-3 bg-muted/20">
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="font-medium">{formatDurationHM(currentDuration)}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{timesheet.status === "running" ? "Active" : "Completed"}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      {timesheet.status === "running" ? (
                        <div
                          className="h-full bg-green-500 animate-pulse-slow"
                          style={{ width: "100%" }}
                        ></div>
                      ) : (
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: "100%" }}
                        ></div>
                      )}
                    </div>
                  </div>

                  {timesheet.status === "running" && (
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                      >
                        <Pause className="h-4 w-4" />
                        Pause
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                      >
                        <StopCircle className="h-4 w-4" />
                        Stop
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border border-gray-200 !gap-3">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      User Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16 border-2 border-muted">
                        {timesheet.user?.picture ? (
                          <AvatarImage
                            src={timesheet.user.picture}
                            alt={timesheet.user.name}
                          />
                        ) : (
                          <AvatarFallback className="text-lg font-medium bg-muted">
                            {getInitials(timesheet.user?.name || timesheet.username)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-bold">{timesheet.user?.name || timesheet.username}</h3>
                        {timesheet.user?.email && <p className="text-muted-foreground">{timesheet.user.email}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {(timesheet.task || timesheet.activity || timesheet.project) && (
                  <Card className="border border-gray-200 !gap-3">
                    <CardHeader className="pb-0">
                      <CardTitle className="text-base font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Associated With
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {timesheet.task && (
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-md flex items-center justify-center text-white"
                            style={{ backgroundColor: timesheet.task.activity?.color || "#64748b" }}
                          >
                            <ClipboardList className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{timesheet.task.title}</p>
                            <p className="text-xs text-muted-foreground">Task #{timesheet.task.id}</p>
                          </div>
                        </div>
                      )}

                      {timesheet.activity && (
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-md flex items-center justify-center text-white"
                            style={{ backgroundColor: timesheet.activity.color || "#64748b" }}
                          >
                            <Activity className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{timesheet.activity.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Activity #{timesheet.activity.activity_number}
                            </p>
                          </div>
                        </div>
                      )}

                      {timesheet.project && (
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-md flex items-center justify-center text-white"
                            style={{ backgroundColor: timesheet.project.color || "#64748b" }}
                          >
                            <Briefcase className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{timesheet.project.name}</p>
                            <p className="text-xs text-muted-foreground">Project #{timesheet.project.project_number}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {timesheet.description && (
                <Card className="border border-gray-200 !gap-3">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{timesheet.description}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent
              value="details"
              className="space-y-6 pt-6"
            >
              <Card className="border border-gray-200 !gap-3">
                <CardHeader className="pb-0">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Hourglass className="h-4 w-4" />
                    Timesheet Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Start Time</p>
                          <p className="font-medium">{formatDateTime(timesheet.start_time)}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">End Time</p>
                          <p className="font-medium">
                            {timesheet.status === "running" ? (
                              <span className="text-green-500 flex items-center gap-1.5">
                                <Play className="h-3 w-3 fill-green-500" />
                                Still running
                              </span>
                            ) : (
                              formatDateTime(timesheet.end_time)
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Hourglass className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Duration</p>
                          <p className="font-medium">{formatDurationHM(currentDuration)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Created</p>
                          <p className="font-medium">{formatDateTime(timesheet.created_at)}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Last Updated</p>
                          <p className="font-medium">{formatDateTime(timesheet.updated_at)}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <AlarmClock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <p
                            className={`font-medium ${timesheet.status === "running" ? "text-green-500" : "text-blue-500"}`}
                          >
                            {timesheet.status === "running" ? "Running" : "Stopped"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 !gap-3">
                <CardHeader className="pb-0">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    User Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {timesheet.user ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-2 border-muted">
                          {timesheet.user.picture ? (
                            <AvatarImage
                              src={timesheet.user.picture}
                              alt={timesheet.user.name}
                            />
                          ) : (
                            <AvatarFallback className="text-lg font-medium bg-muted">
                              {getInitials(timesheet.user.name)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-bold">{timesheet.user.name}</h3>
                          <p className="text-muted-foreground">{timesheet.user.email}</p>
                          {timesheet.user.nickname && (
                            <p className="text-sm text-muted-foreground">@{timesheet.user.nickname}</p>
                          )}
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm text-muted-foreground">Account Created</p>
                              <p className="font-medium">{formatDate(timesheet.user.created_at)}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm text-muted-foreground">Last Updated</p>
                              <p className="font-medium">{formatDate(timesheet.user.updated_at)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <User className="h-10 w-10 text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium">Limited User Information</h3>
                      <p className="text-muted-foreground">Only username is available: {timesheet.username}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {timesheet.description && (
                <Card className="border border-gray-200 !gap-3">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <p>{timesheet.description}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent
              value="related"
              className="space-y-6 pt-6"
            >
              {timesheet.task && (
                <Card className="border border-gray-200 !gap-3">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <ClipboardList className="h-4 w-4" />
                      Task Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-md flex items-center justify-center text-white"
                        style={{ backgroundColor: timesheet.task.activity?.color || "#64748b" }}
                      >
                        <ClipboardList className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{timesheet.task.title}</h4>
                        <p className="text-sm text-muted-foreground">Task #{timesheet.task.id}</p>
                      </div>
                      <Badge
                        className="ml-auto"
                        variant={timesheet.task.deleted_at ? "secondary" : "outline"}
                      >
                        {timesheet.task.deleted_at ? (
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Completed
                          </span>
                        ) : (
                          "Active"
                        )}
                      </Badge>
                    </div>

                    {timesheet.task.description && (
                      <div className="text-sm text-muted-foreground mb-4">{timesheet.task.description}</div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1 border rounded-lg p-3 bg-muted/20">
                        <p className="text-xs text-muted-foreground">Created</p>
                        <p className="font-medium">{formatDate(timesheet.task.created_at)}</p>
                      </div>

                      {timesheet.task.deadline && (
                        <div className="space-y-1 border rounded-lg p-3 bg-muted/20">
                          <p className="text-xs text-muted-foreground">Deadline</p>
                          <p className="font-medium">{formatDate(timesheet.task.deadline)}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {timesheet.activity && (
                <Card className="border border-gray-200 !gap-3">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Activity Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-md flex items-center justify-center text-white"
                        style={{ backgroundColor: timesheet.activity.color || "#64748b" }}
                      >
                        <Activity className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{timesheet.activity.name}</h4>
                        <p className="text-sm text-muted-foreground">Activity #{timesheet.activity.activity_number}</p>
                      </div>
                      <Badge
                        className="ml-auto"
                        style={{
                          backgroundColor: `${timesheet.activity.color}20` || "#f1f5f9",
                          color: timesheet.activity.color || "inherit"
                        }}
                      >
                        {timesheet.activity.deleted_at ? "Cancelled" : "Active"}
                      </Badge>
                    </div>

                    {timesheet.activity.description && (
                      <div className="text-sm text-muted-foreground mb-4">{timesheet.activity.description}</div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1 border rounded-lg p-3 bg-muted/20">
                        <p className="text-xs text-muted-foreground">Budget</p>
                        <p className="font-medium">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0
                          }).format(timesheet.activity.budget)}
                        </p>
                      </div>

                      <div className="space-y-1 border rounded-lg p-3 bg-muted/20">
                        <p className="text-xs text-muted-foreground">Created</p>
                        <p className="font-medium">{formatDate(timesheet.activity.created_at)}</p>
                      </div>
                    </div>

                    {timesheet.activity.team && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium mb-2">Team</p>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-md flex items-center justify-center text-white"
                            style={{ backgroundColor: timesheet.activity.team.color || "#64748b" }}
                          >
                            <Users className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{timesheet.activity.team.name}</p>
                            <p className="text-xs text-muted-foreground">Team #{timesheet.activity.team.id}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {timesheet.project && (
                <Card className="border border-gray-200 !gap-3">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Project Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-md flex items-center justify-center text-white"
                        style={{ backgroundColor: timesheet.project.color || "#64748b" }}
                      >
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{timesheet.project.name}</h4>
                        <p className="text-sm text-muted-foreground">Project #{timesheet.project.project_number}</p>
                      </div>
                      <Badge
                        className="ml-auto"
                        style={{
                          backgroundColor: `${timesheet.project.color}20` || "#f1f5f9",
                          color: timesheet.project.color || "inherit"
                        }}
                      >
                        {timesheet.project.deleted_at ? "Cancelled" : "Active"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1 border rounded-lg p-3 bg-muted/20">
                        <p className="text-xs text-muted-foreground">Timeline</p>
                        <p className="font-medium">
                          {formatDate(timesheet.project.start_date)} - {formatDate(timesheet.project.end_date)}
                        </p>
                      </div>

                      <div className="space-y-1 border rounded-lg p-3 bg-muted/20">
                        <p className="text-xs text-muted-foreground">Budget</p>
                        <p className="font-medium">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0
                          }).format(timesheet.project.budget)}
                        </p>
                      </div>
                    </div>

                    {timesheet.project.customer && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium mb-2">Customer</p>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-md flex items-center justify-center text-white"
                            style={{ backgroundColor: timesheet.project.customer.color || "#64748b" }}
                          >
                            <Building2 className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{timesheet.project.customer.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {timesheet.project.customer.company_name || `Customer #${timesheet.project.customer.id}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {!timesheet.task && !timesheet.activity && !timesheet.project && (
                <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/20">
                  <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No Related Items</h3>
                  <p className="text-muted-foreground">
                    This timesheet is not associated with any task, activity, or project.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
