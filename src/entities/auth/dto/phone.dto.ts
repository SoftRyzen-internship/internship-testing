import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class PhoneDto {
  @ApiProperty({
    example: '+380999999999',
    description: 'User phone',
    required: true,
  })
  @IsPhoneNumber()
  @IsNotEmpty()
  public phone: string;
}
