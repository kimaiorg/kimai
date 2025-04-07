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
