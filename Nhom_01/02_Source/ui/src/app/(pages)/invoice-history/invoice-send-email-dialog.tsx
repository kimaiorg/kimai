"use client";

import { sendInvoiceViaEmail } from "@/api/invoice.api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { InvoiceHistoryType } from "@/type_schema/invoice";
import { format } from "date-fns";
import {
  AlertCircle,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Globe,
  Hash,
  Mail,
  MapPin,
  Phone,
  Receipt,
  Send,
  XCircle
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

export default function InvoiceSendMailDialog({
  children,
  targetInvoice,
  refetchData
}: {
  children: React.ReactNode;
  targetInvoice: InvoiceHistoryType;
  refetchData: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailInput, setEmailInput] = useState(targetInvoice.customer.email);

  async function handleSendMail() {
    if (loading) return;
    setLoading(true);
    try {
      const response = await sendInvoiceViaEmail(targetInvoice.id, emailInput);
      if (response == 200 || response == 201) {
        toast("Success", {
          description: "Send invoice mail to customer successfully",
          duration: 2000,
          className: "!bg-lime-500 !text-white"
        });
        refetchData();
        setOpen(false);
      } else {
        toast("Failed", {
          description: "Failed to send mail. Please try again!",
          duration: 2000,
          className: "!bg-red-500 !text-white"
        });
      }
    } catch (error: unknown) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  // Format currency
  const formatCurrency = (amount: number | string, currency: string) => {
    const numAmount = typeof amount === "string" ? Number.parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD"
    }).format(numAmount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "NEW":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-600 border-blue-200"
          >
            <AlertCircle className="mr-1 h-3 w-3" /> New
          </Badge>
        );
      case "PAID":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-600 border-green-200"
          >
            <CheckCircle2 className="mr-1 h-3 w-3" /> Paid
          </Badge>
        );
      case "CANCELED":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-600 border-red-200"
          >
            <XCircle className="mr-1 h-3 w-3" /> Canceled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <AlertCircle className="mr-1 h-3 w-3" /> {status}
          </Badge>
        );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] w-[42rem] max-w-[95vw] overflow-hidden border border-gray-200 p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-semibold flex items-center">
            <Mail className="mr-2 h-5 w-5 text-blue-600" />
            Send Invoice via Email
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Review invoice details before sending to customer
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[50vh] px-6">
          <div className="space-y-6 pb-4">
            {/* Invoice Header */}
            <Card className="border border-gray-100 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <Receipt className="mr-2 h-5 w-5 text-gray-600" />
                    Invoice #{targetInvoice.id}
                  </CardTitle>
                  {getStatusBadge(targetInvoice.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm font-medium">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      Invoice Date
                    </div>
                    <div className="pl-6 text-sm">{formatDate(targetInvoice.date)}</div>
                  </div>
                  {targetInvoice.dueDate && (
                    <div className="space-y-2">
                      <div className="flex items-center text-sm font-medium">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        Due Date
                      </div>
                      <div className="pl-6 text-sm">{formatDate(targetInvoice.dueDate)}</div>
                    </div>
                  )}
                </div>
                {(targetInvoice.fromDate || targetInvoice.toDate) && (
                  <div className="space-y-2">
                    <div className="flex items-center text-sm font-medium">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      Service Period
                    </div>
                    <div className="pl-6 text-sm">
                      {targetInvoice.fromDate && formatDate(targetInvoice.fromDate)} -{" "}
                      {targetInvoice.toDate && formatDate(targetInvoice.toDate)}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card className="border border-gray-100 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Building2 className="mr-2 h-5 w-5 text-gray-600" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <div className="font-medium text-lg">{targetInvoice.customer.company_name}</div>
                      <div className="text-sm text-muted-foreground">{targetInvoice.customer.name}</div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="text-sm">
                        <div>{targetInvoice.customer.address}</div>
                        <div>{targetInvoice.customer.country}</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{targetInvoice.customer.email}</span>
                    </div>
                    {targetInvoice.customer.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{targetInvoice.customer.phone}</span>
                      </div>
                    )}
                    {targetInvoice.customer.homepage && (
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{targetInvoice.customer.homepage}</span>
                      </div>
                    )}
                    {targetInvoice.customer.vat_id && (
                      <div className="flex items-center space-x-2">
                        <Hash className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">VAT: {targetInvoice.customer.vat_id}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Information */}
            {targetInvoice.project && (
              <Card className="border border-gray-100 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Briefcase className="mr-2 h-5 w-5 text-gray-600" />
                    Project Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="font-medium">{targetInvoice.project.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Project #{targetInvoice.project.project_number}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm">
                        <span className="font-medium">Budget:</span>{" "}
                        {formatCurrency(targetInvoice.project.budget, targetInvoice.currency)}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Period:</span> {formatDate(targetInvoice.project.start_date)} -{" "}
                        {formatDate(targetInvoice.project.end_date)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="border-t !flex-col px-6 py-2 gap-2">
          <div className="">
            <label className="text-sm font-semibold">Customer email</label>
            <Input
              className="py-1 px-4 !mt-0 border-gray-200"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
          </div>
          <div className="flex justify-end items-stretch gap-3">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleSendMail()}
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                <span className="flex items-center">
                  <Send className="mr-2 h-4 w-4" />
                  Send Invoice
                </span>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
