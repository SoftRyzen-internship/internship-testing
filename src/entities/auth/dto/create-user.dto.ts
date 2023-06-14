import {
  Direction,
  Group,
  GroupIntern,
} from '@entities/users/enums/group.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Matches, MinLength } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ example: 'Mark', description: ' User First name' })
  firstName: string;

  @ApiProperty({ example: 'Spencer', description: ' User Last name' })
  lastName: string;

  @ApiProperty({ example: 'email', description: ' User  email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'User password', description: ' User  password' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
    message: 'Password must contain letters and numbers',
  })
  password: string;

  @ApiProperty({ example: 'contactPhone', description: 'User contact phone' })
  @Matches(/^\+380\d{9}$/, {
    message: 'Contact phone must be in the format "+380XXXXXXXXX"',
  })
  phone: string;

  @ApiProperty({
    example: 'Telegram contact',
    description: 'User Telegram contact',
  })
  @Matches(/^t.me\/\w+$/, {
    message: 'Telegram contact must be in the format "t.me/name"',
  })
  telegramContact: string;

  @ApiProperty({
    example: 'Full Stack',
    description: 'Direction in which the user was trained',
    enum: Direction,
  })
  direction: Direction;

  @ApiProperty({
    example: 'Group A',
    description: 'Group in which the user studied',
    enum: Group,
  })
  group: Group;

  @ApiProperty({ example: 'Current city', description: 'User current city' })
  currentCity: string;

  @ApiProperty({
    example: 'Group T',
    description: 'Internship field',
    enum: GroupIntern,
  })
  fieldOfInternship: GroupIntern;
}
