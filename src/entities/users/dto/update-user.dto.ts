import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'Mark', description: 'User First name' })
  @IsString()
  public firstName: string;

  @ApiProperty({ example: 'Spencer', description: 'User Last name' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'email', description: 'User  email' })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+380XXXXXXXXX', description: 'User contact phone' })
  @IsString()
  @Matches(/^\+380\d{9}$/, {
    message: 'Contact phone must be in the format "+380XXXXXXXXX"',
  })
  phone: string;

  @ApiProperty({
    example: 'Telegram contact',
    description: 'User Telegram contact',
  })
  @IsString()
  @Matches(/^t.me\/\w+$/, {
    message: 'Telegram contact must be in the format "t.me/name"',
  })
  telegramContact: string;

  @ApiProperty({
    example: 'Full Stack',
    description: 'Direction in which the user was trained',
  })
  @IsString()
  direction: string;

  @ApiProperty({
    example: 'Group A',
    description: 'Group in which the user studied',
  })
  @IsString()
  group: string;

  @ApiProperty({ example: 'Current city', description: 'User current city' })
  @IsString()
  currentCity: string;

  @ApiProperty({
    example: 'Group T',
    description: 'Internship field',
  })
  @IsString()
  fieldOfInternship: string;

  @ApiProperty({
    example: '5 stream',
    description: 'Name internship stream',
  })
  @IsString()
  nameInternshipStream: string;

  @ApiProperty({
    example: '/avatars/avatar_pokemon.png',
    description: 'User avatar url',
  })
  @IsString()
  avatar: string;
}
