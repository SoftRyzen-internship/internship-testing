import { ApiProperty } from '@nestjs/swagger';
import { MyBaseEntity } from '@utils/base.entity';
import { Matches, MinLength } from 'class-validator';
import { Column, Entity, Unique } from 'typeorm';
import { Direction, Group } from './enums/group.enum';

@Entity('users')
export class User extends MyBaseEntity {
  @ApiProperty({ example: 'Mark', description: ' User First name' })
  @Column({ name: 'first_name', type: 'varchar' })
  firstName: string;

  @ApiProperty({ example: 'Spencer', description: ' User Last name' })
  @Column({ name: 'last_name', type: 'varchar' })
  lastName: string;

  @ApiProperty({ example: 'email', description: ' User  email' })
  @Column({ name: 'email', type: 'varchar' })
  @Unique(['email'])
  email: string;

  @ApiProperty({ example: 'User password', description: ' User  password' })
  @Column({ name: 'password', type: 'varchar' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
    message: 'Password must contain letters and numbers',
  })
  password: string;

  @ApiProperty({ example: 'contactPhone', description: 'User contact phone' })
  @Column({ name: 'phone', type: 'varchar' })
  @Unique(['contactPhone'])
  @Matches(/^\+380\d{9}$/, {
    message: 'Contact phone must be in the format "+380XXXXXXXXX"',
  })
  phone: string;

  @ApiProperty({
    example: 'Telegram contact',
    description: 'User Telegram contact',
  })
  @Column({ name: 'telegramContact', type: 'varchar' })
  @Matches(/^t.me\/\w+$/, {
    message: 'Telegram contact must be in the format "t.me/name"',
  })
  telegramContact: string;

  @ApiProperty({
    example: 'Full Stack',
    description: 'Direction in which the user was trained',
    enum: Direction,
  })
  @Column({ type: 'enum', enum: Direction })
  direction: Direction;

  @ApiProperty({
    example: 'Group 47',
    description: 'Group in which the user studied',
    enum: Group,
  })
  @Column({ type: 'enum', enum: Group })
  group: Group;

  @ApiProperty({ example: 'Current city', description: 'User current city' })
  @Column({ name: 'current_city', type: 'varchar' })
  currentCity: string;

  @ApiProperty({ example: 'URL', description: ' User Avatar' })
  @Column({ name: 'avatar', type: 'varchar' })
  avatar: string;

  @ApiProperty({ example: 'Full Stack', description: ' User Avatar' })
  @Column({ name: 'current_thread', type: 'varchar' })
  currentThread: string;

  @ApiProperty({ example: 'false', description: 'Is verified user' })
  @Column({ name: 'verified', type: 'varchar', default: false })
  verified: boolean;

  @ApiProperty({ example: 'Access token', description: 'User access token' })
  @Column({ name: 'access_token', type: 'varchar', nullable: true })
  accessToken: string;

  @ApiProperty({ example: 'Refresh token', description: 'User access token' })
  @Column({ name: 'refresh_token', type: 'varchar', nullable: true })
  refreshToken: string;
}
