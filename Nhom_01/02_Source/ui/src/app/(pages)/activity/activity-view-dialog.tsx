"use client";

"use client";

import type React from "react";

import { format, isAfter, isBefore, parseISO } from "date-fns";
import {
  Activity,
  BarChart3,
  Briefcase,
  Calendar,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  DollarSign,
  ListChecks,
  Star,
  UserCircle2,
  Users
} from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppSelector } from "@/lib/redux-toolkit/hooks";
import { UserType } from "@/type_schema/user.schema";
import { ActivityType } from "@/type_schema/activity";

export default function ActivityViewDialog({
  children,
  activity
}: {
  children: React.ReactNode;
  activity: ActivityType;
}) {
  const [open, setOpen] = useState(false);
  const userList = useAppSelector((state) => state.userListState.users) as UserType[];

  const findUser = (userId: string) => {
    return userList.find((user) => user.user_id === userId);
  };

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
  const getTaskStatus = (deadline: string) => {
    if (!deadline) return { status: "no-deadline", label: "No Deadline", color: "bg-gray-500" };

    const now = new Date();
    const deadlineDate = parseISO(deadline);

    if (isAfter(now, deadlineDate)) {
      return { status: "overdue", label: "Overdue", color: "bg-red-500" };
    }

    // If deadline is within 2 days
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(now.getDate() + 2);

    if (isBefore(deadlineDate, twoDaysFromNow)) {
      return { status: "soon", label: "Due Soon", color: "bg-amber-500" };
    }

    return { status: "upcoming", label: "Upcoming", color: "bg-green-500" };
  };

  // Calculate completion percentage
  const completedTasks = activity.tasks.filter((task) => task.deleted_at !== null).length;
  const totalTasks = activity.tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Find team lead
  const teamLead = findUser(activity.team!.lead)!;
  const activityTeamUsers = activity.team.users
    .filter((user) => user != activity.team.lead)
    .map((userId) => findUser(userId)!);

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-200">
          <DialogHeader className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-md flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: activity.color || "#64748b" }}
                >
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold">{activity.name}</DialogTitle>
                  <div className="text-sm text-muted-foreground mt-1">
                    Activity #{activity.activity_number} • Project: {activity.project?.name || "Unknown"}
                  </div>
                </div>
              </div>
              <Badge
                className="px-3 py-1.5 text-sm flex items-center gap-1.5"
                style={{
                  backgroundColor: `${activity.color}20` || "#f1f5f9",
                  color: activity.color || "inherit"
                }}
              >
                <ListChecks className="h-4 w-4" />
                {activity.tasks.length} Tasks
              </Badge>
            </div>

            {activity.description && (
              <div className="text-muted-foreground">
                <p>{activity.description}</p>
              </div>
            )}
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
                value="tasks"
                className="cursor-pointer"
              >
                Tasks
              </TabsTrigger>
              <TabsTrigger
                value="team"
                className="cursor-pointer"
              >
                Team
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="overview"
              className="space-y-6 pt-6"
            >
              <Card className="border border-gray-200">
                <CardHeader className="pb-0">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Activity Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Task Completion</span>
                      <span className="font-medium">{completionPercentage}%</span>
                    </div>
                    <Progress
                      value={completionPercentage}
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{completedTasks} completed</span>
                      <span>{totalTasks} total</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1 border rounded-lg p-3 bg-muted/20">
                      <p className="text-xs text-muted-foreground">Created</p>
                      <p className="font-medium">{formatShortDate(activity.created_at)}</p>
                    </div>
                    <div className="space-y-1 border rounded-lg p-3 bg-muted/20">
                      <p className="text-xs text-muted-foreground">Last Updated</p>
                      <p className="font-medium">{formatShortDate(activity.updated_at)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Budget Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Activity Budget</p>
                        <p className="text-2xl font-bold mt-1">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0
                          }).format(activity.budget)}
                        </p>
                      </div>
                      <div
                        className="h-16 w-16 rounded-full border-4 flex items-center justify-center"
                        style={{ borderColor: activity.color || "#e2e8f0" }}
                      >
                        <DollarSign
                          className="h-6 w-6"
                          style={{ color: activity.color || "#64748b" }}
                        />
                      </div>
                    </div>

                    {activity.project?.budget && (
                      <div className="pt-2 mt-2 border-t">
                        <p className="text-sm text-muted-foreground">Project Budget</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="font-medium">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                              maximumFractionDigits: 0
                            }).format(activity.project.budget)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {Math.round((activity.budget / activity.project.budget) * 100)}% of project
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Project Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {activity.project ? (
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div
                            className="w-10 h-10 rounded-md flex items-center justify-center text-white font-bold text-lg"
                            style={{ backgroundColor: activity.project.color || "#64748b" }}
                          >
                            {activity.project.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-semibold">{activity.project.name}</h4>
                            <p className="text-sm text-muted-foreground">Project #{activity.project.project_number}</p>
                          </div>
                        </div>

                        <div className="space-y-3 mt-4">
                          <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm text-muted-foreground">Timeline</p>
                              <p className="font-medium">
                                {formatShortDate(activity.project.start_date)} -{" "}
                                {formatShortDate(activity.project.end_date)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">Project information not available</div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent
              value="tasks"
              className="space-y-6 pt-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Activity Tasks
                </h3>
                <Badge
                  variant="outline"
                  className="px-3 py-1"
                >
                  {activity.tasks?.length || 0} Tasks
                </Badge>
              </div>

              {!activity.tasks || activity.tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/20 border-gray-200">
                  <ClipboardList className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No Tasks Found</h3>
                  <p className="text-muted-foreground">This activity doesn't have any tasks yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activity.tasks.map((task) => {
                    const taskStatus = getTaskStatus(task.deadline);
                    const assignedUser = findUser(activity.team!.users.find((userId) => userId === task.user_id)!);

                    return (
                      <Card
                        key={task.id}
                        className={`overflow-hidden border border-gray-200 ${task.deleted_at ? "border-green-200 bg-green-50" : ""}`}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                {task.deleted_at ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                                ) : (
                                  <div className={`h-3 w-3 rounded-full ${taskStatus.color}`}></div>
                                )}
                                <h4 className="font-semibold text-lg">{task.title}</h4>
                              </div>

                              {task.description && <p className="text-muted-foreground mt-2">{task.description}</p>}

                              <div className="flex flex-wrap items-center gap-3 mt-4">
                                <Badge
                                  variant="outline"
                                  className="flex items-center gap-1.5"
                                >
                                  <CalendarClock className="h-3.5 w-3.5" />
                                  {task.deadline ? formatShortDate(task.deadline) : "No deadline"}
                                </Badge>

                                {task.deleted_at && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-green-100 text-green-800 flex items-center gap-1.5"
                                  >
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Completed
                                  </Badge>
                                )}

                                {!task.deleted_at && task.deadline && (
                                  <Badge
                                    variant="secondary"
                                    className={`
                                      ${taskStatus.status === "overdue" ? "bg-red-100 text-red-800" : ""}
                                      ${taskStatus.status === "soon" ? "bg-amber-100 text-amber-800" : ""}
                                      ${taskStatus.status === "upcoming" ? "bg-green-100 text-green-800" : ""}
                                    `}
                                  >
                                    {taskStatus.label}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {assignedUser && (
                              <div className="ml-4 flex flex-col items-end">
                                <Avatar
                                  className="h-10 w-10 border-2"
                                  style={{ backgroundColor: "#e2e8f0" }}
                                >
                                  {assignedUser.picture ? (
                                    <AvatarImage
                                      src={assignedUser.picture}
                                      alt={assignedUser.name}
                                    />
                                  ) : (
                                    <AvatarFallback
                                      className="text-sm font-medium"
                                      style={{ backgroundColor: "#f1f5f9" }}
                                    >
                                      {getInitials(assignedUser.name)}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                <p className="text-xs text-muted-foreground mt-1">{assignedUser.name}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent
              value="team"
              className="space-y-6 pt-6"
            >
              <Card className="border border-gray-200 !py-3">
                <CardHeader className="pb-0">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Team Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activity.team ? (
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div
                          className="w-10 h-10 rounded-md flex items-center justify-center text-white font-bold text-lg"
                          style={{ backgroundColor: activity.team.color || "#64748b" }}
                        >
                          {activity.team.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold">{activity.team.name}</h4>
                          <p className="text-sm text-muted-foreground">ID: {activity.team.id}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className="ml-auto px-3 py-1"
                        >
                          {activity.team.users?.length || 0} Members
                        </Badge>
                      </div>

                      {teamLead && (
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-muted-foreground mb-3">Team Lead</h4>
                          <div className="flex items-center gap-3 p-4 border rounded-lg">
                            <Avatar
                              className="h-12 w-12 border-2"
                              style={{ borderColor: "#e2e8f0" }}
                            >
                              {teamLead.picture ? (
                                <AvatarImage
                                  src={teamLead.picture}
                                  alt={teamLead.name}
                                />
                              ) : (
                                <AvatarFallback
                                  className="text-lg font-medium"
                                  style={{ backgroundColor: "#f1f5f9" }}
                                >
                                  {getInitials(teamLead.name)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">{teamLead.name}</h4>
                                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                              </div>
                              <p className="text-sm text-muted-foreground">{teamLead.email}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-3">Team Members</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {activityTeamUsers.map((user, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-3 border rounded-lg"
                            >
                              <Avatar
                                className="h-10 w-10 border-2"
                                style={{ borderColor: "#e2e8f0" }}
                              >
                                {user.picture ? (
                                  <AvatarImage
                                    src={user.picture}
                                    alt={user.name}
                                  />
                                ) : (
                                  <AvatarFallback
                                    className="text-sm font-medium"
                                    style={{ backgroundColor: "#f1f5f9" }}
                                  >
                                    {getInitials(user.name)}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div>
                                <h4 className="font-medium">{user.name}</h4>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                      <Users className="h-10 w-10 text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium">No Team Assigned</h3>
                      <p className="text-muted-foreground">This activity doesn't have a team assigned yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border border-gray-200 !py-3">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <UserCircle2 className="h-4 w-4" />
                    Task Assignments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!activity.tasks || activity.tasks.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">No tasks to display</div>
                  ) : (
                    <div className="space-y-4">
                      {activity.team?.users
                        .map((userId) => findUser(userId)!)
                        .map((user) => {
                          const userTasks = activity.tasks.filter((task) => task.user_id === user.user_id);
                          if (userTasks.length === 0) return null;

                          return (
                            <div
                              key={user.user_id}
                              className="border rounded-lg p-4"
                            >
                              <div className="flex items-center gap-3 mb-3">
                                <Avatar
                                  className="h-8 w-8 border-2"
                                  style={{ borderColor: "#e2e8f0" }}
                                >
                                  {user.picture ? (
                                    <AvatarImage
                                      src={user.picture}
                                      alt={user.name}
                                    />
                                  ) : (
                                    <AvatarFallback
                                      className="text-xs font-medium"
                                      style={{ backgroundColor: "#f1f5f9" }}
                                    >
                                      {getInitials(user.name)}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                <div>
                                  <h4 className="font-medium">{user.name}</h4>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {userTasks.length} Tasks
                                    </Badge>
                                    {user.user_id === activity.team?.lead && (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs bg-amber-100 text-amber-800"
                                      >
                                        Team Lead
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2 mt-2 pl-11">
                                {userTasks.map((task) => {
                                  const taskStatus = getTaskStatus(task.deadline);

                                  return (
                                    <div
                                      key={task.id}
                                      className="flex items-center justify-between text-sm"
                                    >
                                      <div className="flex items-center gap-2">
                                        {task.deleted_at ? (
                                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        ) : (
                                          <div className={`h-2 w-2 rounded-full ${taskStatus.color}`}></div>
                                        )}
                                        <span className={task.deleted_at ? "line-through text-muted-foreground" : ""}>
                                          {task.title}
                                        </span>
                                      </div>
                                      <span className="text-xs text-muted-foreground">
                                        {task.deadline ? formatShortDate(task.deadline) : "No deadline"}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                    </div>
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
