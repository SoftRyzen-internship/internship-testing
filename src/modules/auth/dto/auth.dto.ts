import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

import {
  EMAIL_REGEX,
  LINK_REGEX,
  PASSWORDS_REGEX,
  PHONE_REGEX,
  TELEGRAM_REGEX,
} from '@src/constants/constants';

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
  @Matches(PASSWORDS_REGEX, {
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
    example: LINK_REGEX.toString(),
    description: 'Regular expression for link: resume, linkedin, ...',
  })
  public linkRegex: string;

  @ApiProperty({
    example: TELEGRAM_REGEX.toString(),
    description: 'Regular expression for telegram',
  })
  public telegramRegex: string;

  @ApiProperty({
    example: PHONE_REGEX.toString(),
    description: 'Regular expression for phone',
  })
  public phoneRegex: string;

  @ApiProperty({
    example: PASSWORDS_REGEX.toString(),
    description: 'Regular expression for password',
  })
  public passwordRegex: string;

  @ApiProperty({
    example: EMAIL_REGEX.toString(),
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
