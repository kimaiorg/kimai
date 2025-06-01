import { z } from 'zod';

// Schema cho request tạo invoice từ kết quả filter
export const createInvoiceFromFilterSchema = z.object({
  // ID of the filtered invoice to generate a permanent invoice from
  filteredInvoiceId: z.number(),
  
  // Optional fields that can override values from the filtered invoice
  userId: z.union([z.string(), z.number()]).transform(val => typeof val === 'string' ? parseInt(val, 10) : val).optional(),
  dueDays: z.number().optional().default(14),
  comment: z.string().optional(),
  timesheetIds: z.array(z.number()).optional().default([]),
  
  // These fields are extracted from the filtered invoice, so they're optional in the request
  customerId: z.number().optional(),
  total: z.number().optional(),
  tax: z.number().optional(),
  subtotal: z.number().optional(),
  
  // Legacy fields - kept for backward compatibility
  customer_id: z.number().optional(),
  project_id: z.number().optional(),
  activities: z.array(z.number()).optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  items: z
    .array(
      z.object({
        description: z.string(),
        quantity: z.number(),
        unit_price: z.number(),
        tax_rate: z.number(),
        date: z.string().optional(),
      }),
    )
    .optional(),
  notes: z.string().optional(),
  currency: z.string().optional().default('USD'),
  status: z.string().optional().default('NEW'),
});

export type CreateInvoiceFromFilterDto = z.infer<
  typeof createInvoiceFromFilterSchema
>;

// Hàm chuyển đổi từ DTO (snake_case) sang model (camelCase)
export function transformCreateInvoiceFromFilterDto(
  dto: CreateInvoiceFromFilterDto,
): any {
  return {
    filteredInvoiceId: dto.filteredInvoiceId,
    userId: dto.userId,
    dueDays: dto.dueDays,
    comment: dto.comment,
    timesheetIds: dto.timesheetIds,
    
    // Legacy fields
    customerId: dto.customer_id,
    projectId: dto.project_id,
    activityIds: dto.activities,
    fromDate: dto.from,
    toDate: dto.to,
    items: dto.items?.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      taxRate: item.tax_rate,
      date: item.date,
    })),
    notes: dto.notes,
    currency: dto.currency,
    status: dto.status,
  };
}
