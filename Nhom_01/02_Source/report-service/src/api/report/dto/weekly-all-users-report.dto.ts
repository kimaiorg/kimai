import { IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WeeklyAllUsersReportDto {
  @ApiProperty({
    description: 'Start date for the report period (ISO format)',
    example: '2025-01-01',
    required: true
  })
  @IsNotEmpty({message: 'fromDate is required'})
  @IsDateString({}, {message: 'fromDate must be a valid date string'})
  fromDate: string;

  @ApiProperty({
    description: 'End date for the report period (ISO format)',
    example: '2025-01-07',
    required: true
  })
  @IsNotEmpty({message: 'toDate is required'})
  @IsDateString({}, {message: 'toDate must be a valid date string'})
  toDate: string;
}
