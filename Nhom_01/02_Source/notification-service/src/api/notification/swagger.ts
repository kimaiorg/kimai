import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';

export class CreateNotificationSwaggerDto {
  @ApiProperty({
    example: 'timesheet',
    description: 'Target ID',
  })
  target_id: string;

  @ApiProperty({
    example: NotificationType.absence_request,
    enum: NotificationType,
    description: 'Type of the notification',
  })
  type: NotificationType;

  @ApiPropertyOptional({
    example: 'Absence Request',
    description: 'Title of the notification',
  })
  title: string;

  @ApiPropertyOptional({
    example: 'Absence Request',
    description: 'Content of the notification',
  })
  content: string;
}

export class UpdateNotificationSwaggerDto {
  @ApiProperty({
    example: true,
    description: 'Has read the notification',
  })
  hasRead: boolean;
}

export class ListNotificationsSwaggerDto {
  @ApiPropertyOptional({
    example: '2023-01-01',
    description: 'Start date for filtering notifications',
  })
  startDate?: Date;

  @ApiPropertyOptional({
    example: '2023-12-31',
    description: 'End date for filtering notifications',
  })
  endDate?: Date;

  @ApiPropertyOptional({
    example: NotificationType.absence_request,
    enum: NotificationType,
    description: 'Type of the notification',
  })
  type?: NotificationType;

  @ApiPropertyOptional({
    example: 'timesheet',
    description: 'Target ID',
  })
  targetId?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Has read the notification',
  })
  hasRead?: boolean;

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
