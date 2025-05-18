import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RequestType, RequestStatus } from '@prisma/client';
export class CreateRequestSwagger {
  @ApiProperty({
    example: 'Design Phase',
    description: 'Name of the request',
  })
  comment: string;

  @ApiProperty({
    example: 'Design Phase',
    description: 'Name of the request',
  })
  type: RequestType;

  @ApiProperty({
    example: 'Design Phase',
    description: 'Name of the request',
  })
  target_id: string;

  @ApiPropertyOptional({
    example: {
      quantity: 10,
    },
    description: 'Data of the request',
  })
  request_data: Record<string, JSON>;
}

export class UpdateRequestSwagger {
  @ApiPropertyOptional({
    example: 'Design Phase',
    description: 'Name of the request',
  })
  status: RequestStatus;
}

export class ListRequestSwaggerDto {
  @ApiPropertyOptional({
    example: 5,
    description: 'Filter requests by User ID',
  })
  user_id?: string;

  @ApiPropertyOptional({
    example: 2,
    description: 'Filter requests by Team ID',
  })
  team_id?: number;

  @ApiPropertyOptional({
    example: 'design',
    description: 'Search keyword to filter requests by comment',
  })
  keyword?: string;

  @ApiPropertyOptional({
    example: 'design',
    description: 'Search keyword to filter requests by comment',
  })
  status?: RequestStatus;

  @ApiPropertyOptional({
    example: 'design',
    description: 'Search keyword to filter requests by comment',
  })
  type?: RequestType;

  @ApiPropertyOptional({
    example: '2024-01-01',
    description: 'Filter requests by date',
  })
  from_date?: string;

  @ApiPropertyOptional({
    example: '2024-01-01',
    description: 'Filter requests by date',
  })
  to_date?: string;

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
    example: 'created_at | updated_at',
    enum: ['created_at', 'updated_at'],
    description: 'Field to sort by',
    default: 'created_at',
  })
  sort_by?: 'created_at' | 'updated_at';

  @ApiPropertyOptional({
    example: 'desc',
    enum: ['asc', 'desc'],
    description: 'Sort order',
    default: 'desc',
  })
  sort_order?: 'asc' | 'desc';
}
