import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';

export class PhoneDto {
  @ApiProperty({ example: '+380999999999', description: 'User phone' })
  @IsPhoneNumber()
  phone: string;
}

export class PhoneCodeDto {
  @ApiProperty({ example: '+380', description: 'Country calling code' })
  phone_code: string;

  @ApiProperty({ example: 'Ukraine', description: 'Country name' })
  name: string;

  @ApiProperty({ example: 'UA', description: 'Country alpha2' })
  alpha2: string;

  @ApiProperty({
    example: 'https://flagcdn.com/ua.svg',
    description: 'Country flag .svg',
  })
  flag_url: string;
}
