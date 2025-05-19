"use client";

import { confirmUpdateTimesheet, rejectUpdateTimesheet } from "@/api/request.api";
import { hasRole } from "@/components/shared/authenticated-route";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAppSelector } from "@/lib/redux-toolkit/hooks";
import { ApprovalStatus, RequestUpdateType } from "@/type_schema/request";
import { Role, RolePermissionType } from "@/type_schema/role";
import {
  TimesheetStatus,
  TimesheetType,
  TimesheetUpdateRequestType,
  TimesheetUpdateStatusRequestType
} from "@/type_schema/timesheet";
import { formatDate } from "date-fns";
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
import { toast } from "sonner";

export default function TimesheetRequestDialog({
  children,
  targetTimesheetUpdate,
  fetchTimesheetUpdates
}: {
  children: React.ReactNode;
  targetTimesheetUpdate: RequestUpdateType<TimesheetType, TimesheetUpdateRequestType>;
  fetchTimesheetUpdates: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [commentMessage, setCommentMessage] = useState("");
  const [rejectLoading, setRejectLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const userRolePermissions = useAppSelector((state) => state.userState.privilege) as RolePermissionType;
  const allowRoles = [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD];

  const handleConfirmTimesheet = async () => {
    if (confirmLoading) return;
    setConfirmLoading(true);
    try {
      const payload: TimesheetUpdateStatusRequestType = {
        status: ApprovalStatus.APPROVED
      };
      const response = await confirmUpdateTimesheet(payload, targetTimesheetUpdate.id.toString());

      if (response == 201 || response == 200) {
        toast("Success", {
          description: "Confirm timesheet update successfully",
          duration: 2000,
          className: "!bg-lime-500 !text-white"
        });
        fetchTimesheetUpdates();
        setOpen(false);
      } else {
        toast("Failed", {
          description: "Failed to confirm update timesheet. Please try again!",
          duration: 2000,
          className: "!bg-red-500 !text-white"
        });
      }
    } catch (error: unknown) {
      toast("Failed", {
        description: "Failed to update timesheet. Please try again!",
        duration: 2000,
        className: "!bg-red-500 !text-white"
      });
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleRejectTimesheet = async () => {
    if (rejectLoading) return;
    setRejectLoading(true);
    try {
      const payload: TimesheetUpdateStatusRequestType = {
        status: ApprovalStatus.REJECTED
      };
      const response = await rejectUpdateTimesheet(payload, targetTimesheetUpdate.id.toString());

      if (response == 201 || response == 200) {
        toast("Success", {
          description: "Reject timesheet update successfully",
          duration: 2000,
          className: "!bg-lime-500 !text-white"
        });
        fetchTimesheetUpdates();
        setOpen(false);
      } else {
        toast("Failed", {
          description: "Failed to reject update timesheet. Please try again!",
          duration: 2000,
          className: "!bg-red-500 !text-white"
        });
      }
    } catch (error: unknown) {
      toast("Failed", {
        description: "Failed to update timesheet. Please try again!",
        duration: 2000,
        className: "!bg-red-500 !text-white"
      });
    } finally {
      setRejectLoading(false);
    }
  };

  const calculateCurrentDuration = () => {
    if (
      targetTimesheetUpdate.previous_data.status === TimesheetStatus.TRACKED ||
      !targetTimesheetUpdate.previous_data.start_time
    ) {
      return targetTimesheetUpdate.previous_data.duration;
    }

    const startTime = new Date(targetTimesheetUpdate.previous_data.start_time);
    const now = new Date();
    const durationInSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);

    return durationInSeconds;
  };

  const formatDurationHM = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours === 0) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    }

    return `${hours} hour${hours !== 1 ? "s" : ""} ${minutes} minute${minutes !== 1 ? "s" : ""}`;
  };

  const currentDuration = calculateCurrentDuration();

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-200">
        <DialogHeader className="border-b pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-md flex items-center justify-center text-white font-bold text-xl ${
                  targetTimesheetUpdate.status == ApprovalStatus.PROCESSING ? "bg-main" : "bg-sub"
                }`}
              >
                {targetTimesheetUpdate.previous_data.status === TimesheetStatus.TRACKED ? (
                  <Timer className="h-6 w-6 animate-pulse" />
                ) : (
                  <AlarmClock className="h-6 w-6" />
                )}
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">
                  {targetTimesheetUpdate.previous_data.task?.title}
                </DialogTitle>
                <div className="text-sm text-muted-foreground mt-1">
                  Timesheet #{targetTimesheetUpdate.previous_data.id} • {formatDurationHM(currentDuration)}
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>
        {hasRole(userRolePermissions.role, allowRoles) && targetTimesheetUpdate.status == ApprovalStatus.PROCESSING && (
          <>
            <div className="py-2">
              <div className="pb-3">
                <Textarea
                  rows={1}
                  placeholder="Enter your message"
                  className="border border-gray-200"
                  value={commentMessage}
                  onChange={(e) => setCommentMessage(e.target.value)}
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                  onClick={handleRejectTimesheet}
                >
                  Reject
                </Button>
                <Button
                  onClick={handleConfirmTimesheet}
                  className="bg-lime-500 hover:bg-lime-600 text-white cursor-pointer"
                >
                  Confirm
                </Button>
              </div>
            </div>
            <Separator />
          </>
        )}
        <div className="select-none">
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
                      <p className="font-medium">
                        {formatDate(targetTimesheetUpdate.previous_data.start_time, "dd/MM/yyyy HH:mm")}
                      </p>
                    </div>
                    <div className="space-y-1 border rounded-lg p-3 bg-muted/20">
                      <p className="text-xs text-muted-foreground">Ended</p>
                      <p className="font-medium">
                        {targetTimesheetUpdate.previous_data.status === "running" ? (
                          <span className="text-green-500 flex items-center gap-1.5">
                            <Play className="h-3 w-3 fill-green-500" />
                            Still running
                          </span>
                        ) : (
                          formatDate(targetTimesheetUpdate.previous_data.end_time!, "dd/MM/yyyy HH:mm")
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
                      <span className="font-medium">
                        {targetTimesheetUpdate.previous_data.status === TimesheetStatus.TRACKING
                          ? "Active"
                          : "Completed"}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      {targetTimesheetUpdate.previous_data.status === "running" ? (
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

                  {targetTimesheetUpdate.previous_data.status === TimesheetStatus.TRACKING && (
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
                        {targetTimesheetUpdate.previous_data.user?.picture ? (
                          <AvatarImage
                            src={targetTimesheetUpdate.previous_data.user.picture}
                            alt={targetTimesheetUpdate.previous_data.user.name}
                          />
                        ) : (
                          <AvatarFallback className="text-lg font-medium bg-muted">
                            {targetTimesheetUpdate.previous_data.user?.name ||
                              targetTimesheetUpdate.previous_data.username}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-bold">
                          {targetTimesheetUpdate.previous_data.user?.name ||
                            targetTimesheetUpdate.previous_data.username}
                        </h3>
                        {targetTimesheetUpdate.previous_data.user?.email && (
                          <p className="text-muted-foreground">{targetTimesheetUpdate.previous_data.user.email}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {(targetTimesheetUpdate.previous_data.task ||
                  targetTimesheetUpdate.previous_data.activity ||
                  targetTimesheetUpdate.previous_data.project) && (
                  <Card className="border border-gray-200 !gap-3">
                    <CardHeader className="pb-0">
                      <CardTitle className="text-base font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Associated With
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {targetTimesheetUpdate.previous_data.task && (
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-md flex items-center justify-center text-white"
                            style={{
                              backgroundColor: targetTimesheetUpdate.previous_data.task.activity?.color || "#64748b"
                            }}
                          >
                            <ClipboardList className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{targetTimesheetUpdate.previous_data.task.title}</p>
                            <p className="text-xs text-muted-foreground">
                              Task #{targetTimesheetUpdate.previous_data.task.id}
                            </p>
                          </div>
                        </div>
                      )}

                      {targetTimesheetUpdate.previous_data.activity && (
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-md flex items-center justify-center text-white"
                            style={{ backgroundColor: targetTimesheetUpdate.previous_data.activity.color || "#64748b" }}
                          >
                            <Activity className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{targetTimesheetUpdate.previous_data.activity.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Activity #{targetTimesheetUpdate.previous_data.activity.activity_number}
                            </p>
                          </div>
                        </div>
                      )}

                      {targetTimesheetUpdate.previous_data.project && (
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-md flex items-center justify-center text-white"
                            style={{ backgroundColor: targetTimesheetUpdate.previous_data.project.color || "#64748b" }}
                          >
                            <Briefcase className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{targetTimesheetUpdate.previous_data.project.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Project #{targetTimesheetUpdate.previous_data.project.project_number}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {targetTimesheetUpdate.previous_data.description && (
                <Card className="border border-gray-200 !gap-3">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{targetTimesheetUpdate.previous_data.description}</p>
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
                          <p className="font-medium">
                            {formatDate(targetTimesheetUpdate.previous_data.start_time, "HH:mm")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">End Time</p>
                          <p className="font-medium">
                            {targetTimesheetUpdate.previous_data.status === "running" ? (
                              <span className="text-green-500 flex items-center gap-1.5">
                                <Play className="h-3 w-3 fill-green-500" />
                                Still running
                              </span>
                            ) : (
                              formatDate(targetTimesheetUpdate.previous_data.end_time!, "HH:mm")
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
                          <p className="font-medium">
                            {formatDate(targetTimesheetUpdate.previous_data.created_at, "dd/MM/yyyy")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Last Updated</p>
                          <p className="font-medium">
                            {formatDate(targetTimesheetUpdate.previous_data.updated_at, "dd/MM/yyyy")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <AlarmClock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <p
                            className={`font-medium ${targetTimesheetUpdate.previous_data.status === "running" ? "text-green-500" : "text-blue-500"}`}
                          >
                            {targetTimesheetUpdate.previous_data.status === "running" ? "Running" : "Stopped"}
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
                  {targetTimesheetUpdate.previous_data.user ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-2 border-muted">
                          {targetTimesheetUpdate.previous_data.user.picture ? (
                            <AvatarImage
                              src={targetTimesheetUpdate.previous_data.user.picture}
                              alt={targetTimesheetUpdate.previous_data.user.name}
                            />
                          ) : (
                            <AvatarFallback className="text-lg font-medium bg-muted">
                              {targetTimesheetUpdate.previous_data.user.name}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-bold">{targetTimesheetUpdate.previous_data.user.name}</h3>
                          <p className="text-muted-foreground">{targetTimesheetUpdate.previous_data.user.email}</p>
                          {targetTimesheetUpdate.previous_data.user.nickname && (
                            <p className="text-sm text-muted-foreground">
                              @{targetTimesheetUpdate.previous_data.user.nickname}
                            </p>
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
                              <p className="font-medium">
                                {formatDate(targetTimesheetUpdate.previous_data.user.created_at, "dd/MM/yyyy")}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm text-muted-foreground">Last Updated</p>
                              <p className="font-medium">
                                {formatDate(targetTimesheetUpdate.previous_data.user.updated_at, "dd/MM/yyyy")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <User className="h-10 w-10 text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium">Limited User Information</h3>
                      <p className="text-muted-foreground">
                        Only username is available: {targetTimesheetUpdate.previous_data.username}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {targetTimesheetUpdate.previous_data.description && (
                <Card className="border border-gray-200 !gap-3">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <p>{targetTimesheetUpdate.previous_data.description}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent
              value="related"
              className="space-y-6 pt-6"
            >
              {targetTimesheetUpdate.previous_data.task && (
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
                        style={{
                          backgroundColor: targetTimesheetUpdate.previous_data.task.activity?.color || "#64748b"
                        }}
                      >
                        <ClipboardList className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{targetTimesheetUpdate.previous_data.task.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Task #{targetTimesheetUpdate.previous_data.task.id}
                        </p>
                      </div>
                      <Badge
                        className="ml-auto"
                        variant={targetTimesheetUpdate.previous_data.task.deleted_at ? "secondary" : "outline"}
                      >
                        {targetTimesheetUpdate.previous_data.task.deleted_at ? (
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Completed
                          </span>
                        ) : (
                          "Active"
                        )}
                      </Badge>
                    </div>

                    {targetTimesheetUpdate.previous_data.task.description && (
                      <div className="text-sm text-muted-foreground mb-4">
                        {targetTimesheetUpdate.previous_data.task.description}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1 border rounded-lg p-3 bg-muted/20">
                        <p className="text-xs text-muted-foreground">Created</p>
                        <p className="font-medium">
                          {formatDate(targetTimesheetUpdate.previous_data.task.created_at, "dd/MM/yyyy")}
                        </p>
                      </div>

                      {targetTimesheetUpdate.previous_data.task.deadline && (
                        <div className="space-y-1 border rounded-lg p-3 bg-muted/20">
                          <p className="text-xs text-muted-foreground">Deadline</p>
                          <p className="font-medium">
                            {formatDate(targetTimesheetUpdate.previous_data.task.deadline, "dd/MM/yyyy")}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {targetTimesheetUpdate.previous_data.activity && (
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
                        style={{ backgroundColor: targetTimesheetUpdate.previous_data.activity.color || "#64748b" }}
                      >
                        <Activity className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{targetTimesheetUpdate.previous_data.activity.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Activity #{targetTimesheetUpdate.previous_data.activity.activity_number}
                        </p>
                      </div>
                      <Badge
                        className="ml-auto"
                        style={{
                          backgroundColor: `${targetTimesheetUpdate.previous_data.activity.color}20` || "#f1f5f9",
                          color: targetTimesheetUpdate.previous_data.activity.color || "inherit"
                        }}
                      >
                        {targetTimesheetUpdate.previous_data.activity.deleted_at ? "Cancelled" : "Active"}
                      </Badge>
                    </div>

                    {targetTimesheetUpdate.previous_data.activity.description && (
                      <div className="text-sm text-muted-foreground mb-4">
                        {targetTimesheetUpdate.previous_data.activity.description}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1 border rounded-lg p-3 bg-muted/20">
                        <p className="text-xs text-muted-foreground">Budget</p>
                        <p className="font-medium">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0
                          }).format(targetTimesheetUpdate.previous_data.activity.budget)}
                        </p>
                      </div>

                      <div className="space-y-1 border rounded-lg p-3 bg-muted/20">
                        <p className="text-xs text-muted-foreground">Created</p>
                        <p className="font-medium">
                          {formatDate(targetTimesheetUpdate.previous_data.activity.created_at, "dd/MM/yyyy")}
                        </p>
                      </div>
                    </div>

                    {targetTimesheetUpdate.previous_data.activity.team && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium mb-2">Team</p>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-md flex items-center justify-center text-white"
                            style={{
                              backgroundColor: targetTimesheetUpdate.previous_data.activity.team.color || "#64748b"
                            }}
                          >
                            <Users className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{targetTimesheetUpdate.previous_data.activity.team.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Team #{targetTimesheetUpdate.previous_data.activity.team.id}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {targetTimesheetUpdate.previous_data.project && (
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
                        style={{ backgroundColor: targetTimesheetUpdate.previous_data.project.color || "#64748b" }}
                      >
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{targetTimesheetUpdate.previous_data.project.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Project #{targetTimesheetUpdate.previous_data.project.project_number}
                        </p>
                      </div>
                      <Badge
                        className="ml-auto"
                        style={{
                          backgroundColor: `${targetTimesheetUpdate.previous_data.project.color}20` || "#f1f5f9",
                          color: targetTimesheetUpdate.previous_data.project.color || "inherit"
                        }}
                      >
                        {targetTimesheetUpdate.previous_data.project.deleted_at ? "Cancelled" : "Active"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1 border rounded-lg p-3 bg-muted/20">
                        <p className="text-xs text-muted-foreground">Timeline</p>
                        <p className="font-medium">
                          {formatDate(targetTimesheetUpdate.previous_data.project.start_date, "dd/MM/yyyy")} -{" "}
                          {formatDate(targetTimesheetUpdate.previous_data.project.end_date, "dd/MM/yyyy")}
                        </p>
                      </div>

                      <div className="space-y-1 border rounded-lg p-3 bg-muted/20">
                        <p className="text-xs text-muted-foreground">Budget</p>
                        <p className="font-medium">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0
                          }).format(targetTimesheetUpdate.previous_data.project.budget)}
                        </p>
                      </div>
                    </div>

                    {targetTimesheetUpdate.previous_data.project.customer && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium mb-2">Customer</p>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-md flex items-center justify-center text-white"
                            style={{
                              backgroundColor: targetTimesheetUpdate.previous_data.project.customer.color || "#64748b"
                            }}
                          >
                            <Building2 className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{targetTimesheetUpdate.previous_data.project.customer.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {targetTimesheetUpdate.previous_data.project.customer.company_name ||
                                `Customer #${targetTimesheetUpdate.previous_data.project.customer.id}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
