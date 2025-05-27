import { z } from 'zod';

// Định nghĩa schema cho filter fields
const filterFields = {
  name: z.string().optional(),
  is_active: z.coerce.boolean().optional(),
};

// Schema chính cho ListInvoiceTemplateDto
export const listInvoiceTemplateSchema = z
  .object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().optional().default(10),
    sort_by: z.string().optional().default('createdAt'),
    sort_order: z.enum(['asc', 'desc']).optional().default('desc'),

    // Các tham số filter dạng snake_case
    name: z.string().optional(),
    is_active: z.coerce.boolean().optional(),
  })
  .transform((data) => {
    // Chuyển đổi từ snake_case sang camelCase và cấu trúc filters
    const { page, limit, sort_by, sort_order, name, is_active, ...rest } = data;

    // Tạo filters object
    const filters: any = {};

    if (name) filters.name = name;
    if (is_active !== undefined) filters.isActive = is_active;

    return {
      page,
      limit,
      sortBy: sort_by,
      sortOrder: sort_order,
      filters,
    };
  });

export type ListInvoiceTemplateDto = z.infer<typeof listInvoiceTemplateSchema>;
