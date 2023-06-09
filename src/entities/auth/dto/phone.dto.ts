import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';

export class PhoneDto {
  @ApiProperty({ example: '+380999999999', description: 'User phone' })
  @IsPhoneNumber()
  phone: string;
}
