import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskSwagger {
  @ApiProperty({
    example: 'Implement authentication system',
    description: 'Title of the task',
    minLength: 1,
    maxLength: 255,
  })
  title: string;

  @ApiProperty({
    example: '2025-03-30T12:00:00Z',
    description: 'Deadline for the task (ISO 8601 format)',
  })
  deadline: Date;

  @ApiProperty({
    example: 'Develop and integrate JWT authentication',
    description: 'Task description',
    minLength: 1,
    maxLength: 255,
  })
  description: string;

  @ApiProperty({
    example: 101,
    description: 'Activity ID related to the task',
  })
  activity_id: number;

  @ApiProperty({
    example: 'user123',
    description: 'User ID assigned to the task',
  })
  user_id: string;
}

export class UpdateTaskSwagger {
  @ApiPropertyOptional({
    example: 'Implement authentication system',
    description: 'Title of the task',
    minLength: 1,
    maxLength: 255,
  })
  title?: string;

  @ApiPropertyOptional({
    example: '2025-03-30T12:00:00Z',
    description: 'Deadline for the task (ISO 8601 format)',
  })
  deadline?: Date;

  @ApiPropertyOptional({
    example: 'Develop and integrate JWT authentication',
    description: 'Task description',
    minLength: 1,
    maxLength: 255,
  })
  description?: string;

  @ApiPropertyOptional({
    example: 101,
    description: 'Activity ID related to the task',
  })
  activity_id?: number;

  @ApiPropertyOptional({
    example: 'user123',
    description: 'User ID assigned to the task',
  })
  user_id?: string;
}

export class ListTaskSwaggerDto {
  @ApiPropertyOptional({
    example: 2,
    description: 'Filter activities by Activity ID',
  })
  activity_id?: number;

  @ApiPropertyOptional({
    example: 2,
    description: 'Filter activities by User ID',
  })
  user_id?: number;

  @ApiPropertyOptional({
    example: 'design',
    description: 'Search keyword to filter activities by title',
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
    example: 'created_at | title',
    enum: ['created_at', 'title'],
    description: 'Field to sort by',
    default: 'created_at',
  })
  sort_by?: 'created_at' | 'title';

  @ApiPropertyOptional({
    example: 'desc',
    enum: ['asc', 'desc'],
    description: 'Sort order',
    default: 'desc',
  })
  sort_order?: 'asc' | 'desc';
}
