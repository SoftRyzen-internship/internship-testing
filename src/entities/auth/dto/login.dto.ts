import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user@email.com or +380999999999',
    description: 'User login',
  })
  @IsString()
  @Matches(/^(?:[\w.-]+@[\w-]+\.[\w]{2,4})|(?:\+\d{1,3}\d{3,14})$/, {
    message: 'Invalid username format',
  })
  username: string;

  @ApiProperty({ example: 'password', description: 'User password' })
  @IsString()
  @MinLength(8)
  password: string;
}
