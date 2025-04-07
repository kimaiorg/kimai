"use client";

"use client";

import type React from "react";

import { useState } from "react";
import { format, differenceInDays, isAfter, isBefore } from "date-fns";
import {
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Clock3,
  DollarSign,
  FileText,
  Globe,
  Hash,
  Mail,
  MapPin,
  Phone,
  AlertCircle,
  Users,
  CalendarRange,
  Briefcase,
  ArrowRight
} from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ProjectType } from "@/type_schema/project";

export default function ProjectViewDialog({ children, project }: { children: React.ReactNode; project: ProjectType }) {
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

  // Calculate project status
  const getProjectStatus = () => {
    const now = new Date();
    const startDate = new Date(project.start_date);
    const endDate = new Date(project.end_date);

    if (project.deleted_at) {
      return {
        status: "cancelled",
        statusText: "Cancelled",
        statusColor: "bg-red-500",
        statusBg: "bg-red-100",
        statusIcon: <AlertCircle className="h-4 w-4" />
      };
    }

    if (isAfter(now, endDate)) {
      return {
        status: "completed",
        statusText: "Completed",
        statusColor: "bg-green-500",
        statusBg: "bg-green-100",
        statusIcon: <CheckCircle2 className="h-4 w-4" />
      };
    }

    if (isAfter(now, startDate) && isBefore(now, endDate)) {
      return {
        status: "active",
        statusText: "Active",
        statusColor: "bg-amber-500",
        statusBg: "bg-amber-100",
        statusIcon: <BarChart3 className="h-4 w-4" />
      };
    }

    return {
      status: "upcoming",
      statusText: "Upcoming",
      statusColor: "bg-blue-500",
      statusBg: "bg-blue-100",
      statusIcon: <Clock3 className="h-4 w-4" />
    };
  };

  // Calculate project progress
  const calculateProgress = () => {
    const now = new Date();
    const startDate = new Date(project.start_date);
    const endDate = new Date(project.end_date);

    if (isBefore(now, startDate)) return 0;
    if (isAfter(now, endDate)) return 100;

    const totalDuration = differenceInDays(endDate, startDate);
    const elapsedDuration = differenceInDays(now, startDate);

    return Math.round((elapsedDuration / totalDuration) * 100);
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const projectStatus = getProjectStatus();
  const progress = calculateProgress();
  const totalDays = differenceInDays(new Date(project.end_date), new Date(project.start_date));
  const remainingDays = differenceInDays(new Date(project.end_date), new Date());
  const elapsedDays = totalDays - remainingDays;

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
                  style={{ backgroundColor: project.color || "#64748b" }}
                >
                  {project.name.charAt(0)}
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold">{project.name}</DialogTitle>
                  <div className="text-sm text-muted-foreground mt-1">
                    Project #{project.project_number} • Order #{project.order_number}
                  </div>
                </div>
              </div>
              <Badge
                className="px-3 py-1.5 text-sm flex items-center gap-1.5"
                style={{
                  backgroundColor: projectStatus.statusBg,
                  color: project.color || "inherit"
                }}
              >
                {projectStatus.statusIcon}
                {projectStatus.statusText}
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
                value="teams"
                className="cursor-pointer"
              >
                Teams
              </TabsTrigger>
              <TabsTrigger
                value="customer"
                className="cursor-pointer"
              >
                Customer
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="overview"
              className="space-y-6 pt-6"
            >
              <Card className="border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <CalendarRange className="h-4 w-4" />
                    Project Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress
                      value={progress}
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{formatShortDate(project.start_date)}</span>
                      <span>{formatShortDate(project.end_date)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className="space-y-1 border rounded-lg p-3 bg-muted/20">
                      <p className="text-xs text-muted-foreground">Total Duration</p>
                      <p className="font-medium">{totalDays} days</p>
                    </div>
                    <div className="space-y-1 border rounded-lg p-3 bg-muted/20">
                      <p className="text-xs text-muted-foreground">Elapsed</p>
                      <p className="font-medium">{elapsedDays > 0 ? `${elapsedDays} days` : "Not started"}</p>
                    </div>
                    <div className="space-y-1 border rounded-lg p-3 bg-muted/20">
                      <p className="text-xs text-muted-foreground">Remaining</p>
                      <p className="font-medium">{remainingDays > 0 ? `${remainingDays} days` : "Completed"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Project Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Order Date</p>
                          <p className="font-medium">{formatDate(project.order_date)}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Start Date</p>
                          <p className="font-medium">{formatDate(project.start_date)}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">End Date</p>
                          <p className="font-medium">{formatDate(project.end_date)}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Financial Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <DollarSign className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Budget</p>
                          <p className="font-medium text-xl">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: project.customer?.currency || "USD",
                              maximumFractionDigits: 0
                            }).format(project.budget)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Hash className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Currency</p>
                          <p className="font-medium">{project.customer?.currency || "USD"}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Project Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 border-l-2 border-green-500 pl-4 py-1">
                      <div>
                        <p className="font-medium">Created</p>
                        <p className="text-sm text-muted-foreground">{formatDate(project.created_at)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 border-l-2 border-blue-500 pl-4 py-1">
                      <div>
                        <p className="font-medium">Order Placed</p>
                        <p className="text-sm text-muted-foreground">{formatDate(project.order_date)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 border-l-2 border-amber-500 pl-4 py-1">
                      <div>
                        <p className="font-medium">Project Start</p>
                        <p className="text-sm text-muted-foreground">{formatDate(project.start_date)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 border-l-2 border-purple-500 pl-4 py-1">
                      <div>
                        <p className="font-medium">Project End</p>
                        <p className="text-sm text-muted-foreground">{formatDate(project.end_date)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 border-l-2 border-amber-500 pl-4 py-1">
                      <div>
                        <p className="font-medium">Last Updated</p>
                        <p className="text-sm text-muted-foreground">{formatDate(project.updated_at)}</p>
                      </div>
                    </div>

                    {project.deleted_at && (
                      <div className="flex items-start gap-3 border-l-2 border-red-500 pl-4 py-1">
                        <div>
                          <p className="font-medium">Cancelled</p>
                          <p className="text-sm text-muted-foreground">{formatDate(project.deleted_at)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value="teams"
              className="space-y-6 pt-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Project Teams
                </h3>
                <Badge
                  variant="outline"
                  className="px-3 py-1"
                >
                  {project.teams?.length || 0} Teams
                </Badge>
              </div>

              {!project.teams || project.teams.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/20">
                  <Users className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No Teams Assigned</h3>
                  <p className="text-muted-foreground">This project doesn't have any teams assigned yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.teams.map((team) => (
                    <Card
                      key={team.id}
                      className="overflow-hidden !py-0 border border-gray-200"
                    >
                      <div
                        className="h-2"
                        style={{ backgroundColor: team.color || "#e2e8f0" }}
                      ></div>
                      <CardContent className="px-6 py-2">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-md flex items-center justify-center text-white font-bold text-lg"
                              style={{ backgroundColor: team.color || "#64748b" }}
                            >
                              {team.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-semibold">{team.name}</h4>
                              <p className="text-sm text-muted-foreground">ID: {team.id}</p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="px-2 py-1 text-xs"
                          >
                            {team.users.length} Members
                          </Badge>
                        </div>

                        <div className="mt-4">
                          <p className="text-sm text-muted-foreground mb-2">Team Members</p>
                          <div className="flex -space-x-2 overflow-hidden">
                            {team.users.slice(0, 5).map((userId, index) => (
                              <Avatar
                                key={index}
                                className="border-2 border-background w-8 h-8"
                              >
                                <AvatarFallback className="text-xs">
                                  {userId.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {team.users.length > 5 && (
                              <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-background bg-muted text-xs font-medium">
                                +{team.users.length - 5}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent
              value="customer"
              className="space-y-3 pt-6"
            >
              <Card className="border border-gray-200">
                <CardHeader className="pb-0">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar
                      className="h-16 w-16 border-2"
                      style={{ borderColor: project.customer?.color || "#e2e8f0" }}
                    >
                      <AvatarFallback
                        className="text-lg font-medium"
                        style={{ backgroundColor: project.customer?.color || "#f1f5f9" }}
                      >
                        {getInitials(project.customer?.name || "")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold">{project.customer?.name}</h3>
                      <p className="text-muted-foreground">{project.customer?.company_name}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-muted-foreground">Contact Information</h4>
                      <div className="space-y-3">
                        {project.customer?.email && (
                          <div className="flex items-start gap-3">
                            <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm text-muted-foreground">Email</p>
                              <p className="font-medium">{project.customer.email}</p>
                            </div>
                          </div>
                        )}

                        {project.customer?.phone && (
                          <div className="flex items-start gap-3">
                            <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm text-muted-foreground">Phone</p>
                              <p className="font-medium">{project.customer.phone}</p>
                            </div>
                          </div>
                        )}

                        {project.customer?.homepage && (
                          <div className="flex items-start gap-3">
                            <Globe className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm text-muted-foreground">Website</p>
                              <a
                                href={
                                  project.customer.homepage.startsWith("http")
                                    ? project.customer.homepage
                                    : `https://${project.customer.homepage}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-primary hover:underline"
                              >
                                {project.customer.homepage}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-muted-foreground">Address</h4>
                      <div className="space-y-3">
                        {project.customer?.address && (
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                            <div>
                              <p className="whitespace-pre-line">{project.customer.address}</p>
                              {project.customer?.country && (
                                <p className="font-medium mt-1">{project.customer.country}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {project.customer?.description && (
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Description</h4>
                      <p className="text-sm">{project.customer.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Other Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!project.customer?.projects || project.customer.projects.length <= 1 ? (
                    <div className="text-center text-muted-foreground">No other projects with this customer</div>
                  ) : (
                    <div className="space-y-4">
                      {project.customer.projects
                        .filter((p) => p.id !== project.id)
                        .slice(0, 3)
                        .map((otherProject) => (
                          <div
                            key={otherProject.id}
                            className="flex items-center justify-between border rounded-lg p-4"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-md flex items-center justify-center text-white font-bold"
                                style={{ backgroundColor: otherProject.color || "#64748b" }}
                              >
                                {otherProject.name.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-medium">{otherProject.name}</h4>
                                <p className="text-xs text-muted-foreground">#{otherProject.project_number}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="text-xs"
                              >
                                {formatShortDate(otherProject.start_date)}
                                <ArrowRight className="h-3 w-3 mx-1" />
                                {formatShortDate(otherProject.end_date)}
                              </Badge>
                            </div>
                          </div>
                        ))}
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
