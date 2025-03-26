import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateActivitySwagger {
  @ApiProperty({
    example: 'Design Phase',
    description: 'Name of the activity',
  })
  name: string;

  @ApiPropertyOptional({
    example: '#FF5733',
    description: 'Color associated with the activity',
  })
  color?: string;

  @ApiPropertyOptional({
    example: 'Initial phase for designing UI/UX',
    description: 'Description of the activity',
  })
  description?: string;

  @ApiPropertyOptional({
    example: 101,
    description: 'Unique activity number (optional)',
  })
  activity_number?: number;

  @ApiPropertyOptional({
    example: 20000,
    description: 'Budget allocated for the activity (optional)',
  })
  budget?: number;

  @ApiProperty({
    example: 5,
    description: 'Project ID associated with this activity',
  })
  project_id: number;

  @ApiProperty({
    example: 2,
    description: 'Team ID responsible for this activity',
  })
  team_id: number;
}
