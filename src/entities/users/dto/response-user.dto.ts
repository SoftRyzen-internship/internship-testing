import { ApiProperty } from '@nestjs/swagger';

export class ResponseUserDto {
  @ApiProperty({ example: 1, description: 'Unique id user`s' })
  id: number;

  @ApiProperty({
    example: '2023-06-13T14:58:05.590Z',
    description: 'Create At',
  })
  createAt: string;

  @ApiProperty({
    example: '2023-06-13T14:58:05.590Z',
    description: 'Update At',
  })
  updateAt: string;

  @ApiProperty({ example: 'Mark', description: 'User First name' })
  firstName: string;

  @ApiProperty({ example: 'Spencer', description: 'User Last name' })
  lastName: string;

  @ApiProperty({ example: 'email@mail.net', description: 'User email' })
  email: string;

  @ApiProperty({ example: '+380XXXXXXXXX', description: 'User contact phone' })
  phone: string;

  @ApiProperty({
    example: 't.me/userName',
    description: 'User Telegram contact',
  })
  telegramContact: string;

  @ApiProperty({
    example: 'Full Stack',
    description: 'Direction in which the user was trained',
  })
  direction: string;

  @ApiProperty({
    example: 'Group A',
    description: 'Group in which the user studied',
  })
  group: string;

  @ApiProperty({ example: 'Current city', description: 'User current city' })
  currentCity: string;

  @ApiProperty({
    example: '/avatars/avatar_pokemon.png',
    description: 'User avatar url',
  })
  avatar: string;

  @ApiProperty({
    example: 'Group T',
    description: 'Internship field',
  })
  fieldOfInternship: string;

  @ApiProperty({
    example: '5 stream',
    description: 'Name internship stream',
  })
  nameInternshipStream: string;

  @ApiProperty({
    example: 'true',
    description: 'Is confirm email',
  })
  verified: boolean;
}
