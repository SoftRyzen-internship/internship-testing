import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'password', description: 'New password user' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'password', description: 'Confirm password user' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  confirmPassword: string;
}
