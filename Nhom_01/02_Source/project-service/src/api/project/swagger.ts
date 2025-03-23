import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectSwagger {
  @ApiProperty({ example: 'Project Alpha', description: 'Name of the project' })
  name: string;

  @ApiPropertyOptional({
    example: '#FF5733',
    description: 'Color associated with the project',
  })
  color?: string;

  @ApiProperty({ example: 101, description: 'Unique project number' })
  project_number: number;

  @ApiProperty({
    example: 2023001,
    description: 'Order number for the project',
  })
  order_number: number;

  @ApiProperty({
    example: '2025-03-23T00:00:00.000Z',
    description: 'Order date in ISO format (YYYY-MM-DD)',
  })
  order_date: Date;

  @ApiProperty({
    example: '2025-04-01T00:00:00.000Z',
    description: 'Start date in ISO format (YYYY-MM-DD)',
  })
  start_date: Date;

  @ApiProperty({
    example: '2025-12-31T00:00:00.000Z',
    description: 'End date in ISO format (YYYY-MM-DD)',
  })
  end_date: Date;

  @ApiPropertyOptional({
    example: 50000,
    description: 'Budget allocated for the project',
  })
  budget?: number;

  @ApiPropertyOptional({
    example: [1, 2, 3],
    description: 'IDs of the teams assigned to the project',
  })
  teams?: number[];

  @ApiProperty({
    example: 101,
    description: 'ID of the customer',
  })
  customer: number;
}
