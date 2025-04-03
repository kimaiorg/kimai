import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StartTimesheetSwagger {
  @ApiProperty({
    example: 'user_123',
    description: 'ID of the user',
  })
  user_id: string;

  @ApiPropertyOptional({
    example: 'Description of the timesheet',
    description: 'Description of the timesheet',
  })
  description?: string;
}

export class EndTimesheetSwagger {
  @ApiProperty({
    example: 'user_123',
    description: 'ID of the user',
  })
  user_id: string;

  @ApiPropertyOptional({
    example: 'Description of the timesheet',
    description: 'Description of the timesheet',
  })
  description?: string;
}
