import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategorySwagger {
  @ApiProperty({
    example: 'Category 1',
    description: 'Name of the category',
  })
  name: string;

  @ApiPropertyOptional({
    example: 'Description of the category',
    description: 'Description of the category',
  })
  description: string | null;

  @ApiPropertyOptional({
    example: '#000000',
    description: 'Color of the category',
  })
  color: string | null;
}

export class UpdateCategorySwagger {
  @ApiPropertyOptional({
    example: 'Category 1',
    description: 'Name of the category',
  })
  name?: string;

  @ApiPropertyOptional({
    example: 'Description of the category',
    description: 'Description of the category',
  })
  description?: string;

  @ApiPropertyOptional({
    example: '#000000',
    description: 'Color of the category',
  })
  color?: string;
}

export class ListCategorySwaggerDto {
  @ApiPropertyOptional({
    example: 'design',
    description: 'Search keyword to filter categories by name',
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
