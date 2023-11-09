import { ApiProperty } from '@nestjs/swagger';
import * as regex from '@src/constants/regex-expressions';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class UsernameDto {
  @ApiProperty({
    example: 'user@email.com',
    description: 'User login',
  })
  @IsString()
  @IsEmail()
  public email: string;
}

export class LoginDto extends UsernameDto {
  @ApiProperty({ example: 'password', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(regex.passwordRegex, {
    message: 'Password must contain letters and numbers',
  })
  public password: string;
}

export class StreamResponseDto {
  id?: number;
  @ApiProperty({ example: 1, description: 'Ids streams' })
  public streamDirection?: string;

  @ApiProperty({ example: 'true', description: 'Status internship stream' })
  public isActive?: boolean;

  @ApiProperty({
    example: 'Start date',
    description: 'Start date of internship stream',
  })
  public startDate?: Date;
}

export class TestResponseDto {
  @ApiProperty({
    example: false,
    description: 'Has the test been sent?',
  })
  public isSent: boolean;

  @ApiProperty({
    example: false,
    description: 'Is start test',
  })
  public isStartTest: boolean;

  @ApiProperty({
    example: false,
    description: 'Is success test',
  })
  public isSuccess: boolean;

  @ApiProperty({
    example: '2023-07-12 16:03:20.157888',
    description: 'Start date of internship stream',
  })
  public startDate?: Date;

  @ApiProperty({
    example: '2023-07-12 16:03:20.157888',
    description: 'End date of internship stream',
  })
  public endDate?: Date;
}

export class TaskResponseDto {
  @ApiProperty({
    example: false,
    description: 'Start date of internship stream',
  })
  public isSent: boolean;

  @ApiProperty({
    example: false,
    description: 'Start date of internship stream',
  })
  public isSuccess: boolean;

  @ApiProperty({
    example: '25.07.2023 12:00',
    description: 'Start date of internship stream',
  })
  public deadlineDate: Date;
}

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'User id' })
  public id: number;

  @ApiProperty({ example: 'Peter', description: 'User name' })
  public firstName?: string;

  @ApiProperty({ example: 'url avatar', description: 'User avatar' })
  public avatar?: string;

  @ApiProperty({ example: 'FrontEnd', description: 'User direction' })
  public direction?: string;

  @ApiProperty({
    example: false,
    description: 'A label about the presence of active threads',
  })
  public isLabelStream: boolean;

  @ApiProperty({
    example: ['user'],
    description: 'User`s role',
  })
  public roles: string[];

  @ApiProperty({ type: () => StreamResponseDto })
  public stream?: StreamResponseDto;

  @ApiProperty({ type: () => TestResponseDto })
  public test?: TestResponseDto;

  @ApiProperty({ type: () => TaskResponseDto })
  public task?: TaskResponseDto;
}

export class LoginResponseDto {
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

  @ApiProperty({ type: () => UserResponseDto })
  public user: UserResponseDto;
}

export class LogoutResponseDto {
  @ApiProperty({
    example: 'Disconnect...',
    description: 'User logout',
  })
  public message: string;
}
