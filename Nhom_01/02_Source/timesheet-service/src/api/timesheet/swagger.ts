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
    example: 1,
    description: 'ID of the project',
  })
  project_id?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID of the activity',
  })
  activity_id?: number;

  @ApiPropertyOptional({
    example: 2,
    description: 'ID of the task',
  })
  task_id?: number;
}

export class StartTimesheetManuallySwagger {
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
    example: 1,
    description: 'ID of the project',
  })
  project_id?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID of the activity',
  })
  activity_id?: number;

  @ApiPropertyOptional({
    example: 2,
    description: 'ID of the task',
  })
  task_id?: number;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Start date for filtering timesheets',
  })
  start_time: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'End date for filtering timesheets',
  })
  end_time: Date;
}

export class ListTimesheetsMeSwaggerDto {
  @ApiPropertyOptional({
    example: '2023-01-01',
    description: 'Start date for filtering timesheets',
  })
  from_date?: Date;

  @ApiPropertyOptional({
    example: '2023-12-31',
    description: 'End date for filtering timesheets',
  })
  to_date?: Date;

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

export class ListTimesheetsSwaggerDto {
  @ApiPropertyOptional({
    example: '2023-01-01',
    description: 'Start date for filtering timesheets',
  })
  from_date?: Date;

  @ApiPropertyOptional({
    example: '2023-12-31',
    description: 'End date for filtering timesheets',
  })
  to_date?: Date;

  @ApiPropertyOptional({
    example: 'user_id',
    description: 'ID of the user',
  })
  user_id?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID of the project',
  })
  project_id?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID of the activity',
  })
  activity_id?: number;

  @ApiPropertyOptional({
    example: 2,
    description: 'ID of the task',
  })
  task_id?: number;

  @ApiPropertyOptional({
    example: 'running | stopped',
    enum: ['running', 'stopped'],
    description: 'Status of the timesheet',
  })
  status?: 'running' | 'stopped';

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
