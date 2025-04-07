import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StartTimesheetSwagger {
  @ApiPropertyOptional({
    example: 'Description of the timesheet',
    description: 'Description of the timesheet',
  })
  description?: string;

  @ApiPropertyOptional({
    example: 'User123',
    description: 'Username of the user',
  })
  username?: string;

  @ApiPropertyOptional({
    example: 'project_id',
    description: 'ID of the project',
  })
  project_id?: string;

  @ApiPropertyOptional({
    example: 'activity_id',
    description: 'ID of the activity',
  })
  activity_id?: string;

  @ApiPropertyOptional({
    example: 'task_id',
    description: 'ID of the task',
  })
  task_id?: string;
}

export class ListTimesheetsMeSwaggerDto {
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
    example: 'created_at',
    enum: ['created_at'],
    description: 'Field to sort by',
    default: 'created_at',
  })
  sort_by?: 'created_at';

  @ApiPropertyOptional({
    example: 'desc',
    enum: ['asc', 'desc'],
    description: 'Sort order',
    default: 'desc',
  })
  sort_order?: 'asc' | 'desc';
}
