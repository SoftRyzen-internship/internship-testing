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

export class LoginResponseDto {
  @ApiProperty({ example: 'Id', description: 'User id' })
  id: number;

  @ApiProperty({ example: 'Peter', description: 'User name' })
  username: string;

  @ApiProperty({
    example: 'BackEnd',
    description: 'Choosing the direction of the internship',
  })
  fieldOfInternship: string;

  @ApiProperty({
    example: '4',
    description: 'The name of the internship stream',
  })
  nameInternshipStream: string;
}
