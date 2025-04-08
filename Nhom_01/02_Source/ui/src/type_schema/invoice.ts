// Invoice history item type
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
