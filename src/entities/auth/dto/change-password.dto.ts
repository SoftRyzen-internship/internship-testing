import { ApiProperty } from '@nestjs/swagger';
import * as regex from '@utils/regex-expressions';
import { IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'password', description: 'New password user' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(regex.passwordRegex, {
    message: 'Password must contain letters and numbers',
  })
  public password: string;

  @ApiProperty({ example: 'password', description: 'Confirm password user' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(regex.passwordRegex, {
    message: 'Password must contain letters and numbers',
  })
  public confirmPassword: string;
}
