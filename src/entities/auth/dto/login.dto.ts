import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class UsernameDto {
  @ApiProperty({
    example: 'user@email.com',
    description: 'User login',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?:[\w.-]+@[\w-]+\.[\w]{2,4})|(?:\+\d{1,3}\d{3,14})$/, {
    message: 'Invalid username format',
  })
  email: string;
}

export class LoginDto extends UsernameDto {
  @ApiProperty({ example: 'password', description: 'User password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}

export class StreamDto {
  id?: number;
  @ApiProperty({ example: '[1, 2, 3]', description: 'Ids streams' })
  // streamDirection: number[];
  streamDirection?: string;

  @ApiProperty({ example: 'true', description: 'Status internship stream' })
  isActive?: boolean;

  @ApiProperty({
    example: 'Start date',
    description: 'Start date of internship stream',
  })
  startDate?: Date;
}

export class UserDto {
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

  @ApiProperty({ type: () => StreamDto })
  stream?: StreamDto;
}

export class LoginResponseDto {
  refreshToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'User success token',
  })
  successToken: string;

  @ApiProperty({ type: () => UserDto })
  user: UserDto;
}
