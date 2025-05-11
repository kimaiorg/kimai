"use client";

import type React from "react";

import { format } from "date-fns";
import {
  Activity,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ClipboardList,
  DollarSign,
  FileText,
  Hash,
  Info,
  Receipt,
  ShoppingCart,
  Tag,
  Trash2,
  Users,
  Wallet
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpenseType } from "@/type_schema/expense";

export default function ExpenseViewDialog({ children, expense }: { children: React.ReactNode; expense: ExpenseType }) {
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

  // Format currency
  const formatCurrency = (amount: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 2
    }).format(amount);
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

  // Get currency from project's customer if available
  const currency = expense.project?.customer?.currency || "USD";
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
                  style={{ backgroundColor: expense.color || "#64748b" }}
                >
                  <Receipt className="h-6 w-6" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold">{expense.name}</DialogTitle>
                  <div className="text-sm text-muted-foreground mt-1">Expense #{expense.id}</div>
                </div>
              </div>
              <Badge
                className="px-3 py-1.5 text-sm flex items-center gap-1.5"
                style={{
                  backgroundColor: expense.deleted_at ? "bg-red-100" : `${expense.color}20` || "#f1f5f9",
                  color: expense.deleted_at ? "text-red-800" : expense.color || "inherit"
                }}
              >
                {expense.deleted_at ? (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Deleted
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Active
                  </>
                )}
              </Badge>
            </div>

            {expense.description && (
              <div className="mt-4 text-muted-foreground">
                <p>{expense.description}</p>
              </div>
            )}
          </DialogHeader>

          <Tabs
            defaultValue="overview"
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="related">Related Items</TabsTrigger>
            </TabsList>

            <TabsContent
              value="overview"
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
                      <p className="font-medium">{formatCurrency(expense.cost, currency)}</p>
                    </div>
                    <div className="space-y-1 border rounded-lg p-3 bg-muted/20">
                      <p className="text-xs text-muted-foreground">Created</p>
                      <p className="font-medium">{formatShortDate(expense.created_at)}</p>
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
                    {expense.category ? (
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-md flex items-center justify-center text-white"
                          style={{ backgroundColor: expense.category.color || "#64748b" }}
                        >
                          <Tag className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">{expense.category.name}</h3>
                          {expense.category.description && (
                            <p className="text-muted-foreground">{expense.category.description}</p>
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
                            {formatDate(expense.created_at)} at {formatTime(expense.created_at)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Last Updated</p>
                          <p className="font-medium">
                            {formatDate(expense.updated_at)} at {formatTime(expense.updated_at)}
                          </p>
                        </div>
                      </div>

                      {expense.deleted_at && (
                        <div className="flex items-start gap-3">
                          <Trash2 className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Deleted</p>
                            <p className="font-medium text-red-500">
                              {formatDate(expense.deleted_at)} at {formatTime(expense.deleted_at)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {expense.task && expense.task.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <ClipboardList className="h-4 w-4" />
                      Associated Tasks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {expense.task.slice(0, 3).map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between border rounded-lg p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-md flex items-center justify-center text-white"
                              style={{ backgroundColor: expense.activity?.color || "#64748b" }}
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

                      {expense.task.length > 3 && (
                        <div className="text-center mt-2">
                          <Button
                            variant="link"
                            size="sm"
                          >
                            View all {expense.task.length} tasks
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent
              value="details"
              className="space-y-6 pt-6"
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Expense Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <ShoppingCart className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Name</p>
                          <p className="font-medium">{expense.name}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Hash className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">ID</p>
                          <p className="font-medium">{expense.id}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <DollarSign className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Unit Cost</p>
                          <p className="font-medium">{formatCurrency(expense.cost, currency)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Created</p>
                          <p className="font-medium">{formatDate(expense.created_at)}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Last Updated</p>
                          <p className="font-medium">{formatDate(expense.updated_at)}</p>
                        </div>
                      </div>

                      {expense.deleted_at && (
                        <div className="flex items-start gap-3">
                          <Trash2 className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Deleted</p>
                            <p className="font-medium text-red-500">{formatDate(expense.deleted_at)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {expense.description && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <p>{expense.description}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {expense.category && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Category Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="w-10 h-10 rounded-md flex items-center justify-center text-white"
                        style={{ backgroundColor: expense.category.color || "#64748b" }}
                      >
                        <Tag className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{expense.category.name}</h4>
                        <p className="text-sm text-muted-foreground">Category #{expense.category.id}</p>
                      </div>
                    </div>

                    {expense.category.description && (
                      <div className="text-sm text-muted-foreground mb-4">{expense.category.description}</div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1 border rounded-lg p-3 bg-muted/20">
                        <p className="text-xs text-muted-foreground">Created</p>
                        <p className="font-medium">{formatShortDate(expense.category.created_at)}</p>
                      </div>
                      <div className="space-y-1 border rounded-lg p-3 bg-muted/20">
                        <p className="text-xs text-muted-foreground">Last Updated</p>
                        <p className="font-medium">{formatShortDate(expense.category.updated_at)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent
              value="related"
              className="space-y-6 pt-6"
            >
              {expense.project && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Project Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-md flex items-center justify-center text-white"
                        style={{ backgroundColor: expense.project.color || "#64748b" }}
                      >
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{expense.project.name}</h4>
                        <p className="text-sm text-muted-foreground">Project #{expense.project.project_number}</p>
                      </div>
                      <Badge
                        className="ml-auto"
                        style={{
                          backgroundColor: `${expense.project.color}20` || "#f1f5f9",
                          color: expense.project.color || "inherit"
                        }}
                      >
                        {expense.project.deleted_at ? "Cancelled" : "Active"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1 border rounded-lg p-3 bg-muted/20">
                        <p className="text-xs text-muted-foreground">Timeline</p>
                        <p className="font-medium">
                          {formatShortDate(expense.project.start_date)} - {formatShortDate(expense.project.end_date)}
                        </p>
                      </div>

                      <div className="space-y-1 border rounded-lg p-3 bg-muted/20">
                        <p className="text-xs text-muted-foreground">Budget</p>
                        <p className="font-medium">{formatCurrency(expense.project.budget, currency)}</p>
                      </div>
                    </div>

                    {expense.project.customer && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium mb-2">Customer</p>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-md flex items-center justify-center text-white"
                            style={{ backgroundColor: expense.project.customer.color || "#64748b" }}
                          >
                            <Building2 className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{expense.project.customer.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {expense.project.customer.company_name || `Customer #${expense.project.customer.id}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {expense.activity && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Activity Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-md flex items-center justify-center text-white"
                        style={{ backgroundColor: expense.activity.color || "#64748b" }}
                      >
                        <Activity className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{expense.activity.name}</h4>
                        <p className="text-sm text-muted-foreground">Activity #{expense.activity.activity_number}</p>
                      </div>
                      <Badge
                        className="ml-auto"
                        style={{
                          backgroundColor: `${expense.activity.color}20` || "#f1f5f9",
                          color: expense.activity.color || "inherit"
                        }}
                      >
                        {expense.activity.deleted_at ? "Cancelled" : "Active"}
                      </Badge>
                    </div>

                    {expense.activity.description && (
                      <div className="text-sm text-muted-foreground mb-4">{expense.activity.description}</div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1 border rounded-lg p-3 bg-muted/20">
                        <p className="text-xs text-muted-foreground">Budget</p>
                        <p className="font-medium">{formatCurrency(expense.activity.budget, currency)}</p>
                      </div>

                      <div className="space-y-1 border rounded-lg p-3 bg-muted/20">
                        <p className="text-xs text-muted-foreground">Created</p>
                        <p className="font-medium">{formatShortDate(expense.activity.created_at)}</p>
                      </div>
                    </div>

                    {expense.activity.team && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium mb-2">Team</p>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-md flex items-center justify-center text-white"
                            style={{ backgroundColor: expense.activity.team.color || "#64748b" }}
                          >
                            <Users className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{expense.activity.team.name}</p>
                            <p className="text-xs text-muted-foreground">Team #{expense.activity.team.id}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {expense.task && expense.task.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <ClipboardList className="h-4 w-4" />
                      Associated Tasks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {expense.task.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between border rounded-lg p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-md flex items-center justify-center text-white"
                              style={{ backgroundColor: expense.activity?.color || "#64748b" }}
                            >
                              <ClipboardList className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium">{task.title}</p>
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-muted-foreground">Task #{task.id}</p>
                                {task.billable && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs bg-green-100 text-green-800"
                                  >
                                    Billable
                                  </Badge>
                                )}
                              </div>
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
                    </div>
                  </CardContent>
                </Card>
              )}

              {!expense.project && !expense.activity && (!expense.task || expense.task.length === 0) && (
                <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/20">
                  <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No Related Items</h3>
                  <p className="text-muted-foreground">
                    This expense is not associated with any project, activity, or task.
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
