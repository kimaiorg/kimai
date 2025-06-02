import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ProjectOverviewReportDto {
  @ApiProperty({
    description: 'Customer ID to filter projects by (optional)',
    example: 1,
    required: false,
    type: Number
  })
  @IsOptional({message: 'customerId is optional'})
  @IsNumber({}, {message: 'customerId must be a number'})
  @Type(() => Number)
  customerId?: number;
}
