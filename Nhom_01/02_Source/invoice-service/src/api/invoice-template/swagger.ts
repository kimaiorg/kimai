import { ApiProperty } from '@nestjs/swagger';

export class CreateTemplateSwagger {
  @ApiProperty({ description: 'Template name', example: 'Standard Invoice' })
  name: string;

  @ApiProperty({
    description: 'Template content (HTML)',
    example: '<div>Invoice template content</div>',
  })
  content: string;

  @ApiProperty({
    description: 'Whether the template is active',
    example: true,
    required: false,
    default: true,
  })
  isActive?: boolean;

  @ApiProperty({
    description: 'Template variables',
    example: ['customer.name', 'invoice.number'],
    required: false,
    type: [String],
  })
  variables?: string[];

  @ApiProperty({
    description: 'Template description',
    example: 'Standard invoice template for regular customers',
    required: false,
  })
  description?: string;
}

export class UpdateTemplateSwagger {
  @ApiProperty({
    description: 'Template name',
    example: 'Standard Invoice',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'Template content (HTML)',
    example: '<div>Invoice template content</div>',
    required: false,
  })
  content?: string;

  @ApiProperty({
    description: 'Whether the template is active',
    example: true,
    required: false,
  })
  isActive?: boolean;

  @ApiProperty({
    description: 'Template variables',
    example: ['customer.name', 'invoice.number'],
    required: false,
    type: [String],
  })
  variables?: string[];

  @ApiProperty({
    description: 'Template description',
    example: 'Standard invoice template for regular customers',
    required: false,
  })
  description?: string;
}

export class ListTemplateSwagger {
  @ApiProperty({
    description: 'Page number',
    example: 1,
    required: false,
    default: 1,
  })
  page?: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    required: false,
    default: 10,
  })
  limit?: number;

  @ApiProperty({
    description: 'Field to sort by',
    example: 'createdAt',
    required: false,
    default: 'createdAt',
  })
  sortBy?: string;

  @ApiProperty({
    description: 'Sort order',
    example: 'desc',
    enum: ['asc', 'desc'],
    required: false,
    default: 'desc',
  })
  sortOrder?: 'asc' | 'desc';

  @ApiProperty({
    description: 'Filter by name',
    example: 'Standard',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'Filter by active status',
    example: true,
    required: false,
  })
  isActive?: boolean;
}

export class TemplateResponseSwagger {
  @ApiProperty({ description: 'Template ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Template name', example: 'Standard Invoice' })
  name: string;

  @ApiProperty({
    description: 'Template content (HTML)',
    example: '<div>Invoice template content</div>',
  })
  content: string;

  @ApiProperty({ description: 'Whether the template is active', example: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Template variables',
    example: ['customer.name', 'invoice.number'],
    type: [String],
  })
  variables: string[];

  @ApiProperty({
    description: 'Template description',
    example: 'Standard invoice template for regular customers',
  })
  description: string;

  @ApiProperty({
    description: 'Creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

export class PaginatedTemplateResponseSwagger {
  @ApiProperty({
    description: 'List of templates',
    type: [TemplateResponseSwagger],
  })
  items: TemplateResponseSwagger[];

  @ApiProperty({
    description: 'Pagination metadata',
    example: {
      totalItems: 100,
      itemCount: 10,
      itemsPerPage: 10,
      totalPages: 10,
      currentPage: 1,
    },
  })
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
