import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class UsernameDto {
  @ApiProperty({
    example: 'user@email.com or +380999999999',
    description: 'User login',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?:[\w.-]+@[\w-]+\.[\w]{2,4})|(?:\+\d{1,3}\d{3,14})$/, {
    message: 'Invalid username format',
  })
  username: string;
}

export class LoginDto extends UsernameDto {
  @ApiProperty({ example: 'password', description: 'User password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
