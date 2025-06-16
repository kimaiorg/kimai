import { ActivityType } from "@/type_schema/activity";
import { PaginationV2 } from "@/type_schema/common";
import { CustomerType } from "@/type_schema/customer";
import { ProjectType } from "@/type_schema/project";
import { TaskType } from "@/type_schema/task";
import { z } from "zod";

// Invoice history item type
export type InvoiceHistoryItemType = Omit<ActivityType, "tasks"> & {
  totalPrice: number; // Total price of tasks in the activity
  tasks: (TaskType & { price: number })[]; // Tasks in the activity
};

export type InvoiceItemType = {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  date: string;
};

export type InvoiceHistoryType = {
  customer: CustomerType;
  project?: ProjectType;
  fromDate?: string;
  toDate?: string;
  status: string; // NEW, PAID, CANCELED
  totalPrice: number; // Total price of the invoice
  taxRate?: number; // Tax rate
  taxPrice?: number; // Tax price: totalPrice * taxRate
  finalPrice?: number; // Total price after tax: totalPrice + taxPrice
  currency: string; // Currency of the invoice: USD, VND, etc.
  notes?: string; // Additional notes
  comment?: string; // Additional comment
  createdBy: string;
  createdAt: string;
  activities?: InvoiceHistoryItemType[];
  items?: InvoiceItemType[];
  date: string;
  totalAmount?: string;
  dueDate?: string;
  id: string;
};

export type InvoiceHistoryResponseType = {
  data: InvoiceHistoryType;
  filteredInvoiceId: number;
  success: boolean;
};

export type InvoiceHistoryDataResponseType = {
  data: PaginationV2<InvoiceHistoryType>;
  success: boolean;
};

// Invoice status options
export const INVOICE_STATUS_OPTIONS = ["New", "Sent", "Paid", "Cancelled", "Overdue", "Saved"];

// Invoice template type
export type InvoiceTemplateType = {
  id: number;
  name: string;
  format: string;
  title: string;
  companyName: string;
  vatId?: string;
  address?: string;
  contact?: string;
  termsOfPayment?: string;
  bankAccount?: string;
  paymentTerm?: string;
  taxRate?: string;
  language?: string;
  invoiceNumberGenerator?: string;
  invoiceTemplate?: string;
  grouping?: string;
  createdAt: string;
  updatedAt?: string;
};

export const FilterInvoiceRequestSchema = z
  .object({
    customer_id: z.string().nonempty({
      message: "Please select a customer"
    }),
    from: z.string().nonempty({
      message: "Please select a date start"
    }),
    to: z.string().nonempty({
      message: "Please select a date end"
    }),
    project_id: z.string().nonempty({
      message: "Please select a project"
    }),
    activities: z.string().array()
  })
  .strict()
  .superRefine(({ from, to }, ctx) => {
    if (from > to) {
      ctx.addIssue({
        code: "custom",
        message: "End time must be after the start time",
        path: ["to"]
      });
    }
    // if (activities.length === 0) {
    //   ctx.addIssue({
    //     code: "custom",
    //     message: "At least one activity must be selected",
    //     path: ["activities"]
    //   });
    // }
  });

export type FilterInvoiceValidation = z.infer<typeof FilterInvoiceRequestSchema>;
export type FilterInvoiceRequestDTO = {
  customer_id: number;
  from: string;
  to: string;
  project_id: number;
  activities: number[];
};

export type InvoiceType = {
  customer: CustomerType;
  project: ProjectType;
  activities: ActivityType[];
};

export const UpdateInvoiceRequestSchema = z.object({
  comment: z.string(),
  status: z.string().nonempty({
    message: "Please select a status"
  })
});

export type UpdateInvoiceValidation = z.infer<typeof UpdateInvoiceRequestSchema>;
export type UpdateInvoiceRequestDTO = {
  comment: string;
  status: string;
};

export type InvoiceHistoryRequestType = {
  filteredInvoiceId: number;
  userId: string; // Currency of the invoice: USD, VND, etc.
  comment?: string; // Additional notes
  dueDays: number; // ID of the invoice template
};
