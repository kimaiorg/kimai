import { z } from 'zod';

// Schema cho request tạo invoice từ kết quả filter
export const createInvoiceFromFilterSchema = z.object({
  customer_id: z.number(),
  project_id: z.number(),
  activities: z.array(z.number()),
  from: z.string(),
  to: z.string(),
  items: z.array(z.object({
    description: z.string(),
    quantity: z.number(),
    unit_price: z.number(),
    tax_rate: z.number(),
    date: z.string().optional(),
  })).optional(),
  notes: z.string().optional(),
  currency: z.string().default('USD'),
  status: z.string().default('NEW'),
});

export type CreateInvoiceFromFilterDto = z.infer<typeof createInvoiceFromFilterSchema>;

// Hàm chuyển đổi từ DTO (snake_case) sang model (camelCase)
export function transformCreateInvoiceFromFilterDto(dto: CreateInvoiceFromFilterDto): any {
  return {
    customerId: dto.customer_id,
    projectId: dto.project_id,
    activityIds: dto.activities,
    fromDate: dto.from,
    toDate: dto.to,
    items: dto.items?.map(item => ({
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
