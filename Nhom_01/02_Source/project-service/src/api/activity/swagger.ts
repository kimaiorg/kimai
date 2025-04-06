import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateActivitySwagger {
  @ApiProperty({
    example: 'Design Phase',
    description: 'Name of the activity',
  })
  name: string;

  @ApiPropertyOptional({
    example: '#FF5733',
    description: 'Color associated with the activity',
  })
  color?: string;

  @ApiPropertyOptional({
    example: 'Initial phase for designing UI/UX',
    description: 'Description of the activity',
  })
  description?: string;

  @ApiPropertyOptional({
    example: 101,
    description: 'Unique activity number (optional)',
  })
  activity_number?: number;

  @ApiPropertyOptional({
    example: 20000,
    description: 'Budget allocated for the activity (optional)',
  })
  budget?: number;

  @ApiProperty({
    example: 5,
    description: 'Project ID associated with this activity',
  })
  project_id: number;

  @ApiProperty({
    example: 2,
    description: 'Team ID responsible for this activity',
  })
  team_id: number;
}

export class UpdateActivitySwagger {
  @ApiPropertyOptional({
    example: 'Design Phase',
    description: 'Name of the activity',
  })
  name?: string;

  @ApiPropertyOptional({
    example: '#FF5733',
    description: 'Color associated with the activity',
  })
  color?: string;

  @ApiPropertyOptional({
    example: 'Initial phase for designing UI/UX',
    description: 'Description of the activity',
  })
  description?: string;

  @ApiPropertyOptional({
    example: 101,
    description: 'Unique activity number (optional)',
  })
  activity_number?: number;

  @ApiPropertyOptional({
    example: 20000,
    description: 'Budget allocated for the activity (optional)',
  })
  budget?: number;

  @ApiPropertyOptional({
    example: 5,
    description: 'Project ID associated with this activity',
  })
  project_id?: number;

  @ApiPropertyOptional({
    example: 2,
    description: 'Team ID responsible for this activity',
  })
  team_id?: number;
}

export class ListActivitySwaggerDto {
  @ApiPropertyOptional({
    example: 5,
    description: 'Filter activities by Project ID',
  })
  project_id?: number;

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
