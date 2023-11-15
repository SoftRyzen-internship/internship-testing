import { ApiProperty } from '@nestjs/swagger';
import * as regex from '@src/constants/regex-expressions';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class AuthDto {
  @ApiProperty({
    example: 'user@email.com',
    description: 'User login',
  })
  @IsString()
  @IsEmail()
  public email: string;

  @ApiProperty({ example: 'password', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(regex.passwordRegex, {
    message: 'Password must contain letters and numbers',
  })
  public password: string;
}

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

export class RegularExpressionResponseDto {
  @ApiProperty({
    example: regex.linkRegex.toString(),
    description: 'Regular expression for link: resume, linkedin, ...',
  })
  public linkRegex: string;

  @ApiProperty({
    example: regex.telegramRegex.toString(),
    description: 'Regular expression for telegram',
  })
  public telegramRegex: string;

  @ApiProperty({
    example: regex.phoneRegex.toString(),
    description: 'Regular expression for phone',
  })
  public phoneRegex: string;

  @ApiProperty({
    example: regex.passwordRegex.toString(),
    description: 'Regular expression for password',
  })
  public passwordRegex: string;

  @ApiProperty({
    example: regex.emailRegex.toString(),
    description: 'Regular expression for email',
  })
  public emailRegex: string;
}

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'User refresh token"',
  })
  public refreshToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'User success token',
  })
  public accessToken: string;
}

export class LogoutResponseDto {
  @ApiProperty({
    example: 'Disconnect...',
    description: 'User logout',
  })
  public message: string;
}
