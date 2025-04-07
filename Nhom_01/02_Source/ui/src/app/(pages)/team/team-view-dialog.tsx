"use client";

"use client";

import type React from "react";

import { format, isAfter, isBefore, parseISO } from "date-fns";
import {
  Activity,
  BarChart3,
  Briefcase,
  Calendar,
  CalendarRange,
  DollarSign,
  Mail,
  MessageSquare,
  PieChart,
  Star,
  Trophy,
  UserCircle2,
  Users
} from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomerProjectType } from "@/type_schema/project";
import { TeamType } from "@/type_schema/team";

export default function TeamViewDialog({ children, team }: { children: React.ReactNode; team: TeamType }) {
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

  // Calculate project status
  const getProjectStatus = (project: CustomerProjectType) => {
    const now = new Date();
    const startDate = parseISO(project.start_date);
    const endDate = parseISO(project.end_date);

    if (project.deleted_at) {
      return { status: "cancelled", label: "Cancelled", color: "bg-red-500" };
    }

    if (isAfter(now, endDate)) {
      return { status: "completed", label: "Completed", color: "bg-green-500" };
    }

    if (isAfter(now, startDate) && isBefore(now, endDate)) {
      return { status: "active", label: "Active", color: "bg-amber-500" };
    }

    return { status: "upcoming", label: "Upcoming", color: "bg-blue-500" };
  };

  // Calculate team metrics
  const totalProjects = team.projects.length;
  const activeProjects = team.projects.filter((p) => getProjectStatus(p).status === "active").length;
  const completedProjects = team.projects.filter((p) => getProjectStatus(p).status === "completed").length;
  const totalActivities = team.activities.length;
  const totalBudget = team.projects.reduce((sum, project) => sum + project.budget, 0);
  const activitiesBudget = team.activities.reduce((sum, activity) => sum + activity.budget, 0);

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
                  className="w-12 h-12 rounded-md flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: team.color || "#64748b" }}
                >
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold">{team.name}</DialogTitle>
                  <div className="text-sm text-muted-foreground mt-1">
                    Team ID: {team.id} • {team.users.length} Members
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge
                  className="px-3 py-1.5 text-sm flex items-center gap-1.5"
                  style={{
                    backgroundColor: `${team.color}20` || "#f1f5f9",
                    color: team.color || "inherit"
                  }}
                >
                  <Briefcase className="h-4 w-4" />
                  {team.projects.length} Projects
                </Badge>
                <Badge
                  className="px-3 py-1.5 text-sm flex items-center gap-1.5"
                  style={{
                    backgroundColor: `${team.color}20` || "#f1f5f9",
                    color: team.color || "inherit"
                  }}
                >
                  <Activity className="h-4 w-4" />
                  {team.activities.length} Activities
                </Badge>
              </div>
            </div>
          </DialogHeader>

          <Tabs
            defaultValue="overview"
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger
                value="overview"
                className="cursor-pointer"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="members"
                className="cursor-pointer"
              >
                Members
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="cursor-pointer"
              >
                Projects
              </TabsTrigger>
              <TabsTrigger
                value="activities"
                className="cursor-pointer"
              >
                Activities
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="overview"
              className="space-y-6 pt-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border border-gray-200 !gap-3">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Team Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{team.users.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">Including team lead</p>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 !gap-3">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Active Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{activeProjects}</div>
                    <p className="text-xs text-muted-foreground mt-1">Out of {totalProjects} total</p>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 !gap-3">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Total Budget
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0
                      }).format(totalBudget)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Across all projects</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border border-gray-200 !gap-3">
                <CardHeader className="pb-0">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Team Lead
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {team.lead ? (
                    <div className="flex items-center gap-4">
                      <Avatar
                        className="h-16 w-16 border-2"
                        style={{ borderColor: team.color || "#e2e8f0" }}
                      >
                        {team.lead.picture ? (
                          <AvatarImage
                            src={team.lead.picture}
                            alt={team.lead.name}
                          />
                        ) : (
                          <AvatarFallback
                            className="text-lg font-medium"
                            style={{ backgroundColor: team.color || "#f1f5f9" }}
                          >
                            {getInitials(team.lead.name)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold">{team.lead.name}</h3>
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        </div>
                        <p className="text-muted-foreground">{team.lead.email}</p>

                        <div className="flex gap-2 mt-2">
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
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <UserCircle2 className="h-10 w-10 text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium">No Team Lead Assigned</h3>
                      <p className="text-muted-foreground">This team doesn't have a lead assigned yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border border-gray-200 !gap-3">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <PieChart className="h-4 w-4" />
                      Project Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {team.projects.length > 0 ? (
                      <>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Active</span>
                            <span className="font-medium">{activeProjects}</span>
                          </div>
                          <Progress
                            value={(activeProjects / totalProjects) * 100}
                            className="h-2 bg-muted"
                            color="bg-amber-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Completed</span>
                            <span className="font-medium">{completedProjects}</span>
                          </div>
                          <Progress
                            value={(completedProjects / totalProjects) * 100}
                            className="h-2 bg-muted"
                            color="bg-green-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Upcoming</span>
                            <span className="font-medium">{totalProjects - activeProjects - completedProjects}</span>
                          </div>
                          <Progress
                            value={((totalProjects - activeProjects - completedProjects) / totalProjects) * 100}
                            className="h-2 bg-muted"
                            color="bg-blue-500"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-2 text-muted-foreground">No projects assigned to this team</div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 !gap-3">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Budget Allocation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {team.activities.length > 0 ? (
                      <>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Activities Budget</p>
                            <p className="font-medium">
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                                maximumFractionDigits: 0
                              }).format(activitiesBudget)}
                            </p>
                          </div>
                          <div
                            className="h-12 w-12 rounded-full border-4 flex items-center justify-center"
                            style={{ borderColor: team.color || "#e2e8f0" }}
                          >
                            <Activity
                              className="h-5 w-5"
                              style={{ color: team.color || "#64748b" }}
                            />
                          </div>
                        </div>

                        <div className="pt-2 mt-2 border-t">
                          <p className="text-sm text-muted-foreground">Total Projects Budget</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="font-medium">
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                                maximumFractionDigits: 0
                              }).format(totalBudget)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {totalBudget > 0 ? Math.round((activitiesBudget / totalBudget) * 100) : 0}% allocated to
                              activities
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-2 text-muted-foreground">No activities assigned to this team</div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card className="border border-gray-200 !gap-3">
                <CardHeader className="pb-0">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Team Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 border-l-2 border-green-500 pl-4 py-1">
                      <div>
                        <p className="font-medium">Team Created</p>
                        <p className="text-sm text-muted-foreground">{formatDate(team.created_at)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 border-l-2 border-amber-500 pl-4 py-1">
                      <div>
                        <p className="font-medium">Last Updated</p>
                        <p className="text-sm text-muted-foreground">{formatDate(team.updated_at)}</p>
                      </div>
                    </div>

                    {team.deleted_at && (
                      <div className="flex items-start gap-3 border-l-2 border-red-500 pl-4 py-1">
                        <div>
                          <p className="font-medium">Team Disbanded</p>
                          <p className="text-sm text-muted-foreground">{formatDate(team.deleted_at)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value="members"
              className="space-y-6 pt-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Members
                </h3>
                <Badge
                  variant="outline"
                  className="px-3 py-1"
                >
                  {team.users.length} Members
                </Badge>
              </div>

              {team.lead && (
                <Card className="mb-6 border-2 border-gray-200 !gap-3">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-amber-500" />
                      Team Lead
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Avatar
                        className="h-16 w-16 border-2"
                        style={{ borderColor: team.color || "#e2e8f0" }}
                      >
                        {team.lead.picture ? (
                          <AvatarImage
                            src={team.lead.picture}
                            alt={team.lead.name}
                          />
                        ) : (
                          <AvatarFallback
                            className="text-lg font-medium"
                            style={{ backgroundColor: team.color || "#f1f5f9" }}
                          >
                            {getInitials(team.lead.name)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold">{team.lead.name}</h3>
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        </div>
                        <p className="text-muted-foreground">{team.lead.email}</p>
                        {team.lead.nickname && (
                          <p className="text-sm text-muted-foreground mt-1">@{team.lead.nickname}</p>
                        )}

                        <div className="flex gap-2 mt-2">
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
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {team.users
                  .filter((user) => team.lead && user.user_id !== team.lead.user_id)
                  .map((user) => (
                    <Card
                      key={user.user_id}
                      className="border border-gray-200 !gap-3"
                    >
                      <CardContent>
                        <div className="flex items-center gap-4">
                          <Avatar
                            className="h-12 w-12 border-2"
                            style={{ borderColor: team.color || "#e2e8f0" }}
                          >
                            {user.picture ? (
                              <AvatarImage
                                src={user.picture}
                                alt={user.name}
                              />
                            ) : (
                              <AvatarFallback
                                className="text-sm font-medium"
                                style={{ backgroundColor: team.color || "#f1f5f9" }}
                              >
                                {getInitials(user.name)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{user.name}</h4>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            {user.nickname && <p className="text-xs text-muted-foreground">@{user.nickname}</p>}
                          </div>
                          <div className="ml-auto">
                            <Button
                              variant="ghost"
                              size="icon"
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>

              {team.users.length === 0 && (
                <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/20">
                  <Users className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No Team Members</h3>
                  <p className="text-muted-foreground">This team doesn't have any members yet.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent
              value="projects"
              className="space-y-6 pt-6"
            >
              <div className="flex items-center justify-between mb-4 ">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Team Projects
                </h3>
                <Badge
                  variant="outline"
                  className="px-3 py-1"
                >
                  {team.projects.length} Projects
                </Badge>
              </div>

              {team.projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/20 border-gray-200">
                  <Briefcase className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No Projects Assigned</h3>
                  <p className="text-muted-foreground">This team doesn't have any projects assigned yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {team.projects.map((project) => {
                    const projectStatus = getProjectStatus(project);

                    return (
                      <Card
                        key={project.id}
                        className="overflow-hidden border border-gray-200 !gap-3"
                      >
                        <div
                          className="h-2"
                          style={{ backgroundColor: project.color || "#e2e8f0" }}
                        ></div>
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded-md flex items-center justify-center text-white font-bold text-lg"
                                style={{ backgroundColor: project.color || "#64748b" }}
                              >
                                {project.name.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-semibold">{project.name}</h4>
                                <div className="text-sm text-muted-foreground">
                                  #{project.project_number} • Order #{project.order_number}
                                </div>
                              </div>
                            </div>
                            <Badge
                              className="ml-auto"
                              variant="secondary"
                            >
                              <span className={`mr-1.5 h-2 w-2 rounded-full ${projectStatus.color}`}></span>
                              {projectStatus.label}
                            </Badge>
                          </div>

                          <div className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                  <CalendarRange className="h-4 w-4" /> Timeline
                                </p>
                                <div className="mt-1">
                                  <p className="font-medium">
                                    {formatShortDate(project.start_date)} - {formatShortDate(project.end_date)}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                  <DollarSign className="h-4 w-4" /> Budget
                                </p>
                                <p className="font-medium mt-1">
                                  {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                    maximumFractionDigits: 0
                                  }).format(project.budget)}
                                </p>
                              </div>
                            </div>

                            <div>
                              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                <Activity className="h-4 w-4" /> Activities
                              </p>
                              <div className="mt-1">
                                {team.activities.filter((a) => a.project_id === project.id).length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {team.activities
                                      .filter((a) => a.project_id === project.id)
                                      .slice(0, 3)
                                      .map((activity) => (
                                        <Badge
                                          key={activity.id}
                                          variant="outline"
                                          style={{
                                            backgroundColor: `${activity.color}20` || "#f1f5f9",
                                            color: activity.color || "inherit"
                                          }}
                                        >
                                          {activity.name}
                                        </Badge>
                                      ))}
                                    {team.activities.filter((a) => a.project_id === project.id).length > 3 && (
                                      <Badge variant="outline">
                                        +{team.activities.filter((a) => a.project_id === project.id).length - 3} more
                                      </Badge>
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-sm text-muted-foreground">No activities assigned</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent
              value="activities"
              className="space-y-6 pt-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Team Activities
                </h3>
                <Badge
                  variant="outline"
                  className="px-3 py-1"
                >
                  {team.activities.length} Activities
                </Badge>
              </div>

              {team.activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/20 border border-gray-200 ">
                  <Activity className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No Activities Assigned</h3>
                  <p className="text-muted-foreground">This team doesn't have any activities assigned yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {team.activities.map((activity) => (
                    <Card
                      key={activity.id}
                      className="overflow-hidden border border-gray-200 !gap-3"
                    >
                      <div
                        className="h-2"
                        style={{ backgroundColor: activity.color || "#e2e8f0" }}
                      ></div>
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-md flex items-center justify-center text-white font-bold text-lg"
                              style={{ backgroundColor: activity.color || "#64748b" }}
                            >
                              <Activity className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{activity.name}</h4>
                              <div className="text-sm text-muted-foreground">Activity #{activity.activity_number}</div>
                            </div>
                          </div>
                          <Badge
                            className="ml-auto"
                            style={{
                              backgroundColor: `${activity.color}20` || "#f1f5f9",
                              color: activity.color || "inherit"
                            }}
                          >
                            {activity.deleted_at ? "Cancelled" : "Active"}
                          </Badge>
                        </div>

                        {activity.description && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{activity.description}</p>
                        )}

                        <div className="space-y-4 mt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                <Briefcase className="h-4 w-4" /> Project
                              </p>
                              <div className="mt-1">
                                {team.projects.find((p) => p.id === activity.project_id) ? (
                                  <p className="font-medium">
                                    {team.projects.find((p) => p.id === activity.project_id)?.name}
                                  </p>
                                ) : (
                                  <p className="text-sm text-muted-foreground">Unknown project</p>
                                )}
                              </div>
                            </div>

                            <div>
                              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                <DollarSign className="h-4 w-4" /> Budget
                              </p>
                              <p className="font-medium mt-1">
                                {new Intl.NumberFormat("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                  maximumFractionDigits: 0
                                }).format(activity.budget)}
                              </p>
                            </div>
                          </div>

                          <div>
                            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                              <Calendar className="h-4 w-4" /> Created
                            </p>
                            <p className="font-medium mt-1">{formatShortDate(activity.created_at)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
