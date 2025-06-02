import { IsString, IsDateString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class WeeklyUserReportDto {
  @ApiProperty({
    description: 'User ID to get report for (Auth0 ID)',
    example: 'auth0|67d99257463a53ee93784bb3',
    required: true,
    type: String
  })
  @IsNotEmpty({message: 'userId is required'})
  @IsString({message: 'userId must be a string'})
  userId: string;

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
