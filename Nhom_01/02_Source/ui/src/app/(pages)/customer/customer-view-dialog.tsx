"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomerType } from "@/type_schema/customer";
import { format } from "date-fns";
import {
  AlertCircle,
  BarChart3,
  Briefcase,
  Building2,
  Calendar,
  CalendarRange,
  CheckCircle2,
  Clock,
  Clock3,
  CreditCard,
  DollarSign,
  Globe,
  Hash,
  Home,
  Mail,
  MapPin,
  Phone,
  Receipt,
  User,
  Wallet
} from "lucide-react";
import { useState } from "react";

export default function CustomerViewDialog({
  children,
  customer
}: {
  children: React.ReactNode;
  customer: CustomerType;
}) {
  const [open, setOpen] = useState(false);

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch (error) {
      return dateString;
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
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-4">
              <Avatar
                className="h-16 w-16 border-2"
                style={{ borderColor: customer.color || "#e2e8f0" }}
              >
                <AvatarFallback
                  className="text-lg font-medium"
                  style={{ backgroundColor: customer.color || "#f1f5f9" }}
                >
                  {getInitials(customer.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <DialogTitle className="text-2xl font-bold">{customer.name}</DialogTitle>
                <p className="text-muted-foreground">{customer.company_name}</p>
              </div>
              <Badge
                variant="outline"
                className="px-3 py-1 text-sm"
                style={{
                  backgroundColor: `${customer.color}10` || "#f1f5f9",
                  borderColor: customer.color || "#e2e8f0",
                  color: customer.color || "inherit"
                }}
              >
                ID: {customer.id}
              </Badge>
            </div>
            {customer.description && <p className="text-muted-foreground">{customer.description}</p>}
          </DialogHeader>

          <Separator />

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
                value="projects"
                className="cursor-pointer"
              >
                Projects
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
              className="space-y-6 pt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border border-gray-200 !py-0">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      {customer.email && (
                        <div className="flex items-start gap-3">
                          <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{customer.email}</p>
                          </div>
                        </div>
                      )}

                      {customer.phone && (
                        <div className="flex items-start gap-3">
                          <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Phone</p>
                            <p className="font-medium">{customer.phone}</p>
                          </div>
                        </div>
                      )}

                      {customer.homepage && (
                        <div className="flex items-start gap-3">
                          <Globe className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Website</p>
                            <a
                              href={
                                customer.homepage.startsWith("http")
                                  ? customer.homepage
                                  : `https://${customer.homepage}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-primary hover:underline"
                            >
                              {customer.homepage}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 !py-0">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Location
                    </h3>
                    <div className="space-y-3">
                      {customer.address && (
                        <div className="flex items-start gap-3">
                          <Home className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Address</p>
                            <p className="font-medium whitespace-pre-line">{customer.address}</p>
                          </div>
                        </div>
                      )}

                      {customer.country && (
                        <div className="flex items-start gap-3">
                          <Globe className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Country</p>
                            <p className="font-medium">{customer.country}</p>
                          </div>
                        </div>
                      )}

                      {customer.timezone && (
                        <div className="flex items-start gap-3">
                          <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Timezone</p>
                            <p className="font-medium">{customer.timezone}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 !py-0">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Company Details
                    </h3>
                    <div className="space-y-3">
                      {customer.company_name && (
                        <div className="flex items-start gap-3">
                          <Building2 className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Company Name</p>
                            <p className="font-medium">{customer.company_name}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 !py-0">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Wallet className="h-5 w-5" />
                      Financial Information
                    </h3>
                    <div className="space-y-3">
                      {customer.account_number && (
                        <div className="flex items-start gap-3">
                          <CreditCard className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Account Number</p>
                            <p className="font-medium">{customer.account_number}</p>
                          </div>
                        </div>
                      )}

                      {customer.vat_id && (
                        <div className="flex items-start gap-3">
                          <Receipt className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">VAT ID</p>
                            <p className="font-medium">{customer.vat_id}</p>
                          </div>
                        </div>
                      )}

                      {customer.currency && (
                        <div className="flex items-start gap-3">
                          <Hash className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Currency</p>
                            <p className="font-medium">{customer.currency}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent
              value="projects"
              className="space-y-6 pt-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Customer Projects
                </h3>
                <Badge
                  variant="outline"
                  className="px-3 py-1"
                >
                  {customer.projects?.length || 0} Projects
                </Badge>
              </div>

              {!customer.projects || customer.projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/20">
                  <Briefcase className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No Projects Found</h3>
                  <p className="text-muted-foreground">This customer doesn't have any projects yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {customer.projects.map((project) => {
                    // Calculate project status
                    const now = new Date();
                    const startDate = new Date(project.start_date);
                    const endDate = new Date(project.end_date);

                    let status = "upcoming";
                    let statusColor = "bg-blue-500";
                    let statusIcon = <Clock3 className="h-4 w-4" />;
                    let statusText = "Upcoming";

                    if (now > endDate) {
                      status = "completed";
                      statusColor = "bg-green-500";
                      statusIcon = <CheckCircle2 className="h-4 w-4" />;
                      statusText = "Completed";
                    } else if (now >= startDate && now <= endDate) {
                      status = "active";
                      statusColor = "bg-amber-500";
                      statusIcon = <BarChart3 className="h-4 w-4" />;
                      statusText = "Active";
                    }

                    if (project.deleted_at) {
                      status = "cancelled";
                      statusColor = "bg-red-500";
                      statusIcon = <AlertCircle className="h-4 w-4" />;
                      statusText = "Cancelled";
                    }

                    // Format dates
                    const formatProjectDate = (dateString: string) => {
                      try {
                        return format(new Date(dateString), "MMM d, yyyy");
                      } catch (error) {
                        return "Invalid date";
                      }
                    };

                    return (
                      <Card
                        key={project.id}
                        className="overflow-hidden border border-gray-200 !py-0"
                      >
                        <div
                          className="h-2"
                          style={{ backgroundColor: project.color || "#e2e8f0" }}
                        ></div>
                        <CardContent className="pb-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-semibold text-lg">{project.name}</h4>
                              <div className="text-sm text-muted-foreground">
                                #{project.project_number} • Order #{project.order_number}
                              </div>
                            </div>
                            <Badge
                              className="ml-auto"
                              variant="secondary"
                            >
                              <span className={`mr-1.5 h-2 w-2 rounded-full ${statusColor}`}></span>
                              <span className="flex items-center gap-1">
                                {statusIcon}
                                {statusText}
                              </span>
                            </Badge>
                          </div>

                          <div className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                  <CalendarRange className="h-4 w-4" /> Timeline
                                </p>
                                <div className="mt-1 relative pt-1">
                                  <div className="flex mb-2 items-center justify-between">
                                    <div>
                                      <span className="text-xs font-semibold inline-block text-gray-600">
                                        {formatProjectDate(project.start_date)}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-xs font-semibold inline-block text-gray-600">
                                        {formatProjectDate(project.end_date)}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                                    {status === "upcoming" && <div className="w-full bg-blue-100"></div>}
                                    {status === "active" && (
                                      <>
                                        <div
                                          className="bg-amber-500 transition-all"
                                          style={{
                                            width: `${Math.min(
                                              100,
                                              Math.max(
                                                0,
                                                ((now.getTime() - startDate.getTime()) /
                                                  (endDate.getTime() - startDate.getTime())) *
                                                  100
                                              )
                                            )}%`
                                          }}
                                        ></div>
                                        <div className="bg-gray-200 transition-all flex-1"></div>
                                      </>
                                    )}
                                    {status === "completed" && <div className="w-full bg-green-500"></div>}
                                    {status === "cancelled" && <div className="w-full bg-red-300"></div>}
                                  </div>
                                </div>
                              </div>

                              <div>
                                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                  <DollarSign className="h-4 w-4" /> Budget
                                </p>
                                <p className="font-medium mt-1">
                                  {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: customer.currency || "USD",
                                    maximumFractionDigits: 0
                                  }).format(project.budget)}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                  <Calendar className="h-4 w-4" /> Order Date
                                </p>
                                <p className="font-medium mt-1">{formatProjectDate(project.order_date)}</p>
                              </div>

                              <div>
                                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                  <Clock className="h-4 w-4" /> Created
                                </p>
                                <p className="font-medium mt-1">{formatProjectDate(project.created_at)}</p>
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
              value="timeline"
              className="space-y-6 pt-4"
            >
              <Card className="border border-gray-200">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Timeline
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 border-l-2 border-green-500 pl-4 py-1">
                      <div>
                        <p className="font-medium">Created</p>
                        <p className="text-sm text-muted-foreground">{formatDate(customer.created_at)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 border-l-2 border-amber-500 pl-4 py-1">
                      <div>
                        <p className="font-medium">Last Updated</p>
                        <p className="text-sm text-muted-foreground">{formatDate(customer.updated_at)}</p>
                      </div>
                    </div>

                    {customer.deleted_at && (
                      <div className="flex items-start gap-3 border-l-2 border-red-500 pl-4 py-1">
                        <div>
                          <p className="font-medium">Deleted</p>
                          <p className="text-sm text-muted-foreground">{formatDate(customer.deleted_at)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
