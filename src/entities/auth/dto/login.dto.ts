import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user@email.com or +380999999999',
    description: 'User login',
  })
  @IsString()
  username: string;

  @ApiProperty({ example: 'password', description: 'User password' })
  @IsString()
  @MinLength(8)
  password: string;
}
