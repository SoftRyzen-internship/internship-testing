import { ApiProperty } from '@nestjs/swagger';
import * as regex from '@utils/regex-expressions';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class UsernameDto {
  @ApiProperty({
    example: 'user@email.com',
    description: 'User login',
  })
  @IsString()
  @IsEmail()
  email: string;
}

export class LoginDto extends UsernameDto {
  @ApiProperty({ example: 'password', description: 'User password' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(regex.passwordRegex, {
    message: 'Password must contain letters and numbers',
  })
  password: string;
}

export class StreamResponseDto {
  id?: number;
  @ApiProperty({ example: 1, description: 'Ids streams' })
  streamDirection?: string;

  @ApiProperty({ example: 'true', description: 'Status internship stream' })
  isActive?: boolean;

  @ApiProperty({
    example: 'Start date',
    description: 'Start date of internship stream',
  })
  startDate?: Date;
}

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'User id' })
  id: number;

  @ApiProperty({ example: 'Peter', description: 'User name' })
  firstName?: string;

  @ApiProperty({ example: 'url avatar', description: 'User avatar' })
  avatar?: string;

  @ApiProperty({ example: 'FrontEnd', description: 'User direction' })
  direction?: string;

  @ApiProperty({
    example: false,
    description: 'A label about the presence of active threads',
  })
  isLabelStream: boolean;

  @ApiProperty({
    example: '[user]',
    description: 'User`s role',
  })
  roles: string[];

  @ApiProperty({ type: () => StreamResponseDto })
  stream?: StreamResponseDto;
}

export class LoginResponseDto {
  @ApiProperty({
    example: 'Save to cookie, name: refreshToken',
    description: 'Save to cookie, name "refreshToken"',
  })
  refreshToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'User success token',
  })
  successToken: string;

  @ApiProperty({ type: () => UserResponseDto })
  user: UserResponseDto;
}
