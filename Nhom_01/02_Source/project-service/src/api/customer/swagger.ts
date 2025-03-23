import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCustomerSwagger {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the customer',
  })
  name: string;

  @ApiPropertyOptional({
    example: '#FF5733',
    description: 'Favorite color of the customer',
  })
  color?: string;

  @ApiPropertyOptional({
    example: 'VIP customer',
    description: 'Additional description',
  })
  description?: string;

  @ApiProperty({
    example: '123 Main St, New York, USA',
    description: 'Customer address',
  })
  address: string;

  @ApiProperty({
    example: 'Tech Corp',
    description: 'Company name of the customer',
  })
  company_name: string;

  @ApiProperty({
    example: '1234567890',
    description: 'Customer account number',
  })
  account_number: string;

  @ApiProperty({ example: 'VAT123456', description: 'VAT ID of the customer' })
  vat_id: string;

  @ApiProperty({
    example: 'United States',
    description: 'Country of the customer',
  })
  country: string;

  @ApiPropertyOptional({ example: 'USD', description: 'Preferred currency' })
  currency?: string;

  @ApiPropertyOptional({
    example: 'America/New_York',
    description: 'Timezone of the customer',
  })
  timezone?: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Email of the customer',
  })
  email: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Phone number of the customer',
  })
  phone: string;

  @ApiPropertyOptional({
    example: 'https://johndoe.com',
    description: 'Homepage URL of the customer',
  })
  homepage?: string;
}
