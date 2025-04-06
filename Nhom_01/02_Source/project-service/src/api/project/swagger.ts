import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectSwagger {
  @ApiProperty({ example: 'Project Alpha', description: 'Name of the project' })
  name: string;

  @ApiPropertyOptional({
    example: '#FF5733',
    description: 'Color associated with the project',
  })
  color?: string;

  @ApiProperty({ example: 101, description: 'Unique project number' })
  project_number: number;

  @ApiProperty({
    example: 2023001,
    description: 'Order number for the project',
  })
  order_number: number;

  @ApiProperty({
    example: '2025-03-23T00:00:00.000Z',
    description: 'Order date in ISO format (YYYY-MM-DD)',
  })
  order_date: Date;

  @ApiProperty({
    example: '2025-04-01T00:00:00.000Z',
    description: 'Start date in ISO format (YYYY-MM-DD)',
  })
  start_date: Date;

  @ApiProperty({
    example: '2025-12-31T00:00:00.000Z',
    description: 'End date in ISO format (YYYY-MM-DD)',
  })
  end_date: Date;

  @ApiPropertyOptional({
    example: 50000,
    description: 'Budget allocated for the project',
  })
  budget?: number;

  @ApiPropertyOptional({
    example: [1, 2, 3],
    description: 'IDs of the teams assigned to the project',
  })
  teams?: number[];

  @ApiProperty({
    example: 101,
    description: 'ID of the customer',
  })
  customer: number;
}

export class UpdateProjectSwagger {
  @ApiPropertyOptional({
    example: 'Project Alpha',
    description: 'Name of the project',
  })
  name?: string;

  @ApiPropertyOptional({
    example: '#FF5733',
    description: 'Color associated with the project',
  })
  color?: string;

  @ApiPropertyOptional({ example: 101, description: 'Unique project number' })
  project_number?: number;

  @ApiPropertyOptional({
    example: 2023001,
    description: 'Order number for the project',
  })
  order_number?: number;

  @ApiPropertyOptional({
    example: '2025-03-23T00:00:00.000Z',
    description: 'Order date in ISO format (YYYY-MM-DD)',
  })
  order_date?: Date;

  @ApiPropertyOptional({
    example: '2025-04-01T00:00:00.000Z',
    description: 'Start date in ISO format (YYYY-MM-DD)',
  })
  start_date?: Date;

  @ApiPropertyOptional({
    example: '2025-12-31T00:00:00.000Z',
    description: 'End date in ISO format (YYYY-MM-DD)',
  })
  end_date?: Date;

  @ApiPropertyOptional({
    example: 50000,
    description: 'Budget allocated for the project',
  })
  budget?: number;

  @ApiPropertyOptional({
    example: [1, 2, 3],
    description: 'IDs of the teams assigned to the project',
  })
  teams?: number[];

  @ApiPropertyOptional({
    example: 101,
    description: 'ID of the customer',
  })
  customer?: number;
}

export class ListProjectSwaggerDto {
  @ApiPropertyOptional({
    example: 2,
    description: 'Filter activities by Customer ID',
  })
  customer_id?: number;

  @ApiPropertyOptional({
    example: 2,
    description: 'Filter activities by Team ID',
  })
  team_id?: number;

  @ApiPropertyOptional({
    example: 'design',
    description: 'Search keyword to filter activities by name',
  })
  keyword?: string;

  @ApiPropertyOptional({
    example: 10000,
    description: 'Minimum budget for filtering activities',
  })
  budget_from?: number;

  @ApiPropertyOptional({
    example: 30000,
    description: 'Maximum budget for filtering activities',
  })
  budget_to?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Page number for pagination',
    default: 1,
  })
  page?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Number of items per page',
    default: 10,
  })
  limit?: number;

  @ApiPropertyOptional({
    example: 'created_at | name | budget',
    enum: ['created_at', 'name', 'budget'],
    description: 'Field to sort by',
    default: 'created_at',
  })
  sort_by?: 'created_at' | 'name' | 'budget';

  @ApiPropertyOptional({
    example: 'desc',
    enum: ['asc', 'desc'],
    description: 'Sort order',
    default: 'desc',
  })
  sort_order?: 'asc' | 'desc';
}
