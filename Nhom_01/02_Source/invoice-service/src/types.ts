import { PrismaClient, Prisma } from '@prisma/client';

// Sử dụng interface thay vì $inferSelect
const prisma = new PrismaClient();
export type Invoice = InvoiceModel;
export type InvoiceItem = InvoiceItemModel;
export type InvoiceTemplate = InvoiceTemplateModel;

// Định nghĩa các interface cho các model
export interface InvoiceModel {
  id: number;
  invoiceNumber: string;
  customerId: number;
  userId: number;
  total: number | string;
  tax: number | string;
  subtotal: number | string;
  currency: string;
  vat: number | string;
  status: 'NEW' | 'PENDING' | 'PAID' | 'CANCELED' | 'OVERDUE';
  comment?: string | null;
  dueDays: number;
  dueDate: Date;
  paymentDate?: Date | null;
  timesheetIds: number[];
  createdAt: Date;
  updatedAt: Date;
  items?: InvoiceItemModel[];
}

export interface InvoiceItemModel {
  id: number;
  description: string;
  amount: number | string;
  rate: number | string;
  total: number | string;
  timesheetId?: number | null;
  projectId: number;
  activityId?: number | null;
  begin: Date;
  end: Date;
  invoiceId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceTemplateModel {
  id: number;
  name: string;
  title: string;
  company?: string | null;
  address?: string | null;
  vatId?: string | null;
  vatRate?: number | string | null;
  currency: string;
  dueDays: number;
  paymentTerms?: string | null;
  paymentDetails?: string | null;
  template?: string | null;
  numberFormat?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
