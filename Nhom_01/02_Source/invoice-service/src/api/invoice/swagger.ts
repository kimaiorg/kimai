import { ApiProperty, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';

export class InvoiceItemSwagger {
  @ApiProperty({ example: 'Web development' })
  description: string;

  @ApiProperty({ example: 5.5 })
  amount: number;

  @ApiProperty({ example: 100 })
  rate: number;

  @ApiProperty({ example: 550 })
  total: number;

  @ApiProperty({ example: 1001, required: false })
  timesheetId?: number;

  @ApiProperty({ example: 123 })
  projectId: number;

  @ApiProperty({ example: 456, required: false })
  activityId?: number;

  @ApiProperty({ example: '2025-03-10T09:00:00Z' })
  begin: string;

  @ApiProperty({ example: '2025-03-10T14:30:00Z' })
  end: string;
}

export class CreateInvoiceSwagger {
  @ApiProperty({ example: 42 })
  customerId: number;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 1001 })
  total: number;

  @ApiProperty({ example: 91 })
  tax: number;

  @ApiProperty({ example: 910 })
  subtotal: number;

  @ApiProperty({ example: 'USD', default: 'USD' })
  currency: string;

  @ApiProperty({ example: 10, default: 0 })
  vat: number;

  @ApiProperty({ example: 'Invoice for March 2025', required: false })
  comment?: string;

  @ApiProperty({ example: 14, default: 14 })
  dueDays: number;

  @ApiProperty({ example: [1001, 1002], required: false })
  timesheetIds?: number[];

  @ApiProperty({ type: [InvoiceItemSwagger], required: false })
  items?: InvoiceItemSwagger[];
}

export class UpdateInvoiceSwagger {
  @ApiProperty({
    enum: ['NEW', 'PENDING', 'PAID', 'CANCELED', 'OVERDUE'],
    required: false,
  })
  status?: string;

  @ApiProperty({
    example: 'Payment received via bank transfer',
    required: false,
  })
  comment?: string;
}

export class ListInvoiceFiltersSwagger {
  @ApiProperty({
    enum: ['NEW', 'PENDING', 'PAID', 'CANCELED', 'OVERDUE'],
    required: false,
  })
  status?: string;

  @ApiProperty({ example: 42, required: false })
  customerId?: number;

  @ApiProperty({ example: 1, required: false })
  userId?: number;

  @ApiProperty({
    example: {
      gte: '2025-03-01T00:00:00Z',
      lte: '2025-03-31T23:59:59Z',
    },
    required: false,
  })
  createdAt?: {
    gte?: string;
    lte?: string;
  };

  @ApiProperty({ example: 'INV-2025', required: false })
  keyword?: string;
}

export class ListInvoiceSwaggerDto {
  @ApiProperty({ example: 1, required: false, default: 1 })
  page?: number;

  @ApiProperty({ example: 10, required: false, default: 10 })
  limit?: number;

  @ApiProperty({ example: 'createdAt', required: false, default: 'createdAt' })
  sortBy?: string;

  @ApiProperty({ enum: ['asc', 'desc'], required: false, default: 'desc' })
  sortOrder?: string;

  // Các trường filter có thể được gửi trực tiếp
  @ApiProperty({
    enum: ['NEW', 'PENDING', 'PAID', 'CANCELED', 'OVERDUE'],
    required: false,
    description: 'Filter by status (direct)',
  })
  status?: string;

  @ApiProperty({
    example: 42,
    required: false,
    description: 'Filter by customer ID (direct)',
  })
  customerId?: number;

  @ApiProperty({
    example: 1,
    required: false,
    description: 'Filter by user ID (direct)',
  })
  userId?: number;

  @ApiProperty({
    example: 'INV-2025',
    required: false,
    description: 'Filter by keyword (direct)',
  })
  keyword?: string;

  // Hoặc được đặt trong thuộc tính filters
  @ApiProperty({
    type: ListInvoiceFiltersSwagger,
    required: false,
    description: 'Nested filters object',
  })
  filters?: ListInvoiceFiltersSwagger;
}

// Thêm FilterInvoiceSwaggerDto dựa trên cấu trúc của frontend
export class FilterInvoiceSwaggerDto {
  @ApiProperty({ example: 42, description: 'Customer ID' })
  customer_id: number;

  @ApiProperty({
    example: '2025-03-01T00:00:00Z',
    description: 'Start date (ISO format)',
  })
  from: string;

  @ApiProperty({
    example: '2025-03-31T23:59:59Z',
    description: 'End date (ISO format)',
  })
  to: string;

  @ApiProperty({ example: 123, description: 'Project ID' })
  project_id: number;

  @ApiProperty({
    example: 'month',
    required: false,
    description: 'Period type (day, week, month, etc.)',
  })
  period?: string;

  @ApiProperty({ example: [456, 789], description: 'List of activity IDs' })
  activities: number[];
}

// Thêm UpdateInvoiceStatusSwaggerDto dựa trên cấu trúc của frontend
export class UpdateInvoiceStatusSwaggerDto {
  @ApiProperty({
    example: 'Payment received via bank transfer',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: 'PAID',
    enum: ['NEW', 'PENDING', 'PAID', 'CANCELED', 'OVERDUE'],
    description: 'Invoice status',
  })
  status: string;

  @ApiProperty({
    example: '2025-04-30T00:00:00Z',
    description: 'Payment date (ISO format)',
  })
  paymentDate: string;
}

export class CreateInvoiceFromFilterSwaggerDto {
  @ApiProperty({
    description: 'ID của khách hàng',
    example: 1,
  })
  customer_id: number;

  @ApiProperty({
    description: 'ID của dự án',
    example: 1,
  })
  project_id: number;

  @ApiProperty({
    description: 'Danh sách ID của các hoạt động',
    example: [1, 2, 3],
    type: [Number],
  })
  activities: number[];

  @ApiProperty({
    description: 'Ngày bắt đầu',
    example: '2025-01-01',
  })
  from: string;

  @ApiProperty({
    description: 'Ngày kết thúc',
    example: '2025-01-31',
  })
  to: string;

  @ApiProperty({
    description: 'Danh sách các mục trong hóa đơn',
    example: [
      {
        description: 'Development work',
        quantity: 8,
        unit_price: 50,
        tax_rate: 10,
        date: '2025-01-15T00:00:00Z',
      },
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        description: { type: 'string' },
        quantity: { type: 'number' },
        unit_price: { type: 'number' },
        tax_rate: { type: 'number' },
        date: { type: 'string' },
      },
    },
    required: false,
  })
  items?: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    tax_rate: number;
    date?: string;
  }>;

  @ApiProperty({
    description: 'Ghi chú cho hóa đơn',
    example: 'Invoice for January 2025',
    required: false,
  })
  notes?: string;

  @ApiProperty({
    description: 'Đơn vị tiền tệ',
    example: 'USD',
    default: 'USD',
    required: false,
  })
  currency?: string;

  @ApiProperty({
    description: 'Trạng thái hóa đơn',
    example: 'NEW',
    default: 'NEW',
    required: false,
  })
  status?: string;
}

@ApiExtraModels()
export class SendInvoiceEmailSwaggerDto {
  @ApiProperty({
    description: 'Type of email to send. Defaults to "standard" if not provided.',
    enum: ['standard', 'update_notification'],
    default: 'standard',
    required: false,
  })
  emailType?: string;

  @ApiProperty({
    description: 'Optional sender information to include in the email',
    required: false,
    type: 'object',
    properties: {
      userId: {
        type: 'string',
        description: 'ID of the user sending the email',
      },
      userName: {
        type: 'string',
        description: 'Name of the user sending the email',
      },
    },
  })
  senderInfo?: {
    userId?: string | number;
    userName?: string;
  };
  
  @ApiProperty({
    description: 'Optional email address to send to instead of customer email. If provided, this email will be used as the recipient instead of the customer\'s email from the database.',
    required: false,
  })
  email?: string;
}

// Example response schema for the send email endpoint
export class SendInvoiceEmailResponseDto {
  @ApiProperty({
    description: 'Whether the operation was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Message describing the result of the operation',
    example: 'Invoice email sent successfully and status updated to PENDING',
  })
  message: string;

  @ApiProperty({
    description: 'Additional data about the email sending operation',
    required: false,
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        description: 'Whether the email was sent successfully',
        example: true,
      },
      message: {
        type: 'string',
        description: 'Message about the email sending operation',
        example: 'Email sent successfully to recipient@example.com',
      },
      statusUpdated: {
        type: 'boolean',
        description: 'Whether the invoice status was updated to PENDING',
        example: true,
      },
      emailDetails: {
        type: 'object',
        description: 'Details about the email that was sent',
      },
    },
  })
  data?: any;
}
