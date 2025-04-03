import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTeamSwagger {
  @ApiProperty({ example: 'Development Team', description: 'Name of the team' })
  name: string;

  @ApiPropertyOptional({
    example: '#FF5733',
    description: 'Color associated with the team',
  })
  color?: string;

  @ApiProperty({ example: 'user123', description: 'ID of lead' })
  lead: string;

  @ApiPropertyOptional({
    example: ['user123', 'user456'],
    description: 'List of user IDs belonging to the team',
  })
  users?: string[];
}
