import { ApiProperty } from '@nestjs/swagger';
import { PASSWORDS_REGEX } from '@src/constants/constants';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'password', description: 'New password user' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(PASSWORDS_REGEX, {
    message: 'Password must contain letters and numbers',
  })
  public password: string;

  @ApiProperty({ example: 'password', description: 'Confirm password user' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(PASSWORDS_REGEX, {
    message: 'Password must contain letters and numbers',
  })
  public confirmPassword: string;
}

export class ChangePasswordResponseDto {
  @ApiProperty({ example: 'Password changed', description: 'Change password' })
  message: string;
}
