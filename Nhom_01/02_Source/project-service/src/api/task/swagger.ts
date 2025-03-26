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
