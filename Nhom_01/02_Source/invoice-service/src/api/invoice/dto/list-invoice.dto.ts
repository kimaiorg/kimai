import { z } from 'zod';

export const listInvoiceSchema = z
  .object({
    page: z.coerce.number().positive().optional().default(1),
    limit: z.coerce.number().positive().optional().default(10),
    sort_by: z.string().optional().default('createdAt'),
    sort_order: z.enum(['asc', 'desc']).optional().default('desc'),

    // Các tham số filter dạng snake_case
    status: z
      .enum(['NEW', 'PENDING', 'PAID', 'CANCELED', 'OVERDUE'])
      .optional(),
    customer_id: z.coerce.number().optional(),
    user_id: z.coerce.number().optional(),
    keyword: z.string().optional(),

    // Hỗ trợ tham số date range
    from_date: z.string().optional(),
    to_date: z.string().optional(),
    
    // Authorization header for service calls
    auth_header: z.string().optional(),
  })
  .transform((data) => {
    // Chuyển đổi từ snake_case sang camelCase và cấu trúc filters
    const {
      page,
      limit,
      sort_by,
      sort_order,
      status,
      customer_id,
      user_id,
      keyword,
      from_date,
      to_date,
      auth_header,
      ...rest
    } = data;

    // Tạo filters object
    const filters: any = {};

    if (status) filters.status = status;
    if (customer_id) filters.customerId = customer_id;
    if (user_id) filters.userId = user_id;
    if (keyword) filters.keyword = keyword;

    // Xử lý date range
    if (from_date || to_date) {
      filters.createdAt = {};
      if (from_date) filters.createdAt.gte = new Date(from_date);
      if (to_date) filters.createdAt.lte = new Date(to_date);
    }

    // Create the result object with required repository parameters
    const result = {
      page,
      limit,
      sortBy: sort_by,
      sortOrder: sort_order,
      filters,
    };
    
    // Only add authHeader if it exists (making it optional)
    if (auth_header) {
      (result as any).authHeader = auth_header;
    }
    
    return result;
  });

export type ListInvoiceDto = z.infer<typeof listInvoiceSchema>;
