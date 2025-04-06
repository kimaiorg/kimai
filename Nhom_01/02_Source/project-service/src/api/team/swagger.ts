import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTeamSwagger {
  @ApiProperty({ example: 'Development Team', description: 'Name of the team' })
  name: string;

  @ApiPropertyOptional({
    example: '#FF5733',
    description: 'Color associated with the team',
  })
  color?: string;

  @ApiProperty({ example: 'user123', description: 'ID of lead' })
  lead: string;

  @ApiPropertyOptional({
    example: ['user123', 'user456'],
    description: 'List of user IDs belonging to the team',
  })
  users?: string[];
}

export class UpdateTeamSwagger {
  @ApiPropertyOptional({
    example: 'Development Team',
    description: 'Name of the team',
  })
  name?: string;

  @ApiPropertyOptional({
    example: '#FF5733',
    description: 'Color associated with the team',
  })
  color?: string;

  @ApiPropertyOptional({ example: 'user123', description: 'ID of lead' })
  lead?: string;

  @ApiPropertyOptional({
    example: ['user123', 'user456'],
    description: 'List of user IDs belonging to the team',
  })
  users?: string[];
}

export class ListTeamSwaggerDto {
  @ApiPropertyOptional({
    example: 'user123',
    description: 'Filter activities by Lead ID',
  })
  lead_id?: string;

  @ApiPropertyOptional({
    example: 2,
    description: 'Filter activities by Project ID',
  })
  project_id?: number;

  @ApiPropertyOptional({
    example: 'design',
    description: 'Search keyword to filter activities by name',
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
    example: 'created_at | name',
    enum: ['created_at', 'name'],
    description: 'Field to sort by',
    default: 'created_at',
  })
  sort_by?: 'created_at' | 'name';

  @ApiPropertyOptional({
    example: 'desc',
    enum: ['asc', 'desc'],
    description: 'Sort order',
    default: 'desc',
  })
  sort_order?: 'asc' | 'desc';
}
