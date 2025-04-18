import { ActivityType } from "@/type_schema/activity";
import { CustomerType } from "@/type_schema/customer";
import { ProjectType } from "@/type_schema/project";
import { z } from "zod";

// Invoice history item type
export type InvoiceHistoryItemType = {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  date?: string;
};

export type InvoiceHistoryType = {
  id: string;
  customer: CustomerType;
  date: string;
  dueDate?: string;
  status: string;
  totalPrice: string;
  currency: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  items: InvoiceHistoryItemType[];
};

export interface InvoiceHistoryItem {
  id: string;
  customer: string;
  date: string;
  status: string;
  totalPrice: string;
  currency: string;
  createdBy: string;
  createdAt: string;
  dueDate?: string;
  notes?: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;
    date?: string;
  }[];
}

// Invoice status options
export const INVOICE_STATUS_OPTIONS = ["New", "Sent", "Paid", "Cancelled", "Overdue", "Saved"];

// Invoice template type
export interface InvoiceTemplate {
  id: string;
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
}

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
    period: z.string(),
    activities: z.string().array()
  })
  .strict()
  .superRefine(({ from, to, activities }, ctx) => {
    if (from > to) {
      ctx.addIssue({
        code: "custom",
        message: "End time must be after the start time",
        path: ["to"]
      });
    }
    if (activities.length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "At least one activity must be selected",
        path: ["activities"]
      });
    }
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
  description: z.string(),
  status: z.string().nonempty({
    message: "Please select a status"
  }),
  paymentDate: z.string()
});

export type UpdateInvoiceValidation = z.infer<typeof UpdateInvoiceRequestSchema>;
export type UpdateInvoiceRequestDTO = {
  description: string;
  status: string;
  paymentDate: string;
};
