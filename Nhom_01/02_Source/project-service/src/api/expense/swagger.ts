import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExpenseSwagger {
  @ApiProperty({
    example: 'Expense 1',
    description: 'Name of the expense',
  })
  name: string;

  @ApiPropertyOptional({
    example: 'Description of the expense',
    description: 'Description of the expense',
  })
  description: string | null;

  @ApiProperty({
    example: 1,
    description: 'Category ID',
  })
  category_id: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Project ID',
  })
  project_id?: number;

  @ApiProperty({
    example: 1,
    description: 'Activity ID',
  })
  activity_id: number;

  @ApiProperty({
    example: 100,
    description: 'Cost of the expense',
  })
  cost: number;
}

export class UpdateExpenseSwagger {
  @ApiPropertyOptional({
    example: 'Expense 1',
    description: 'Name of the expense',
  })
  name?: string;

  @ApiPropertyOptional({
    example: 'Description of the expense',
    description: 'Description of the expense',
  })
  description?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Category ID',
  })
  category_id?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Project ID',
  })
  project_id?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Activity ID',
  })
  activity_id?: number;

  @ApiPropertyOptional({
    example: 100,
    description: 'Cost of the expense',
  })
  cost?: number;
}

export class ListExpenseSwaggerDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Category ID',
  })
  category_id?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Project ID',
  })
  project_id?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Activity ID',
  })
  activity_id?: number;

  @ApiPropertyOptional({
    example: 'design',
    description: 'Search keyword to filter expenses by name',
  })
  keyword?: string;

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
    example: 'created_at | cost',
    enum: ['created_at', 'cost'],
    description: 'Field to sort by',
    default: 'created_at',
  })
  sort_by?: 'created_at' | 'cost';

  @ApiPropertyOptional({
    example: 'desc',
    enum: ['asc', 'desc'],
    description: 'Sort order',
    default: 'desc',
  })
  sort_order?: 'asc' | 'desc';
}
