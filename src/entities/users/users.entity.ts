import { ApiProperty } from '@nestjs/swagger';
import { MyBaseEntity } from '@utils/base.entity';
import { Matches, MinLength } from 'class-validator';
import { Column, Entity, JoinTable, ManyToMany, Unique } from 'typeorm';
import { Role } from './role.entity';

@Entity('users')
export class User extends MyBaseEntity {
  @ApiProperty({ example: 'Mark', description: 'User First name' })
  @Column({ name: 'first_name', type: 'varchar', nullable: true })
  firstName: string;

  @ApiProperty({ example: 'Spencer', description: 'User Last name' })
  @Column({ name: 'last_name', type: 'varchar', nullable: true })
  lastName: string;

  @ApiProperty({ example: 'email', description: 'User  email' })
  @Column({ name: 'email', type: 'varchar' })
  @Unique(['email'])
  email: string;

  @ApiProperty({ example: 'User password', description: 'User  password' })
  @Column({ name: 'password', type: 'varchar', nullable: true })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
    message: 'Password must contain letters and numbers',
  })
  password: string;

  @ApiProperty({ example: 'contactPhone', description: 'User contact phone' })
  @Column({ name: 'phone', type: 'varchar',nullable: true })
  @Unique(['phone'])
  @Matches(/^\+380\d{9}$/, {
    message: 'Contact phone must be in the format "+380XXXXXXXXX"',
  })
  phone: string;

  @ApiProperty({
    example: 'Telegram contact',
    description: 'User Telegram contact',
  })
  @Column({ name: 'telegram_contact', type: 'varchar', nullable: true })
  @Matches(/^t.me\/\w+$/, {
    message: 'Telegram contact must be in the format "t.me/name"',
  })
  telegramContact: string;

  @ApiProperty({
    example: 'Full Stack',
    description: 'Direction in which the user was trained',
  })
  @Column({ name: 'direction', type: 'varchar', nullable: true })
  direction: string;

  @ApiProperty({
    example: 'Group 47',
    description: 'Group in which the user studied',
  })
  @Column({ name: 'group', type: 'varchar', nullable: true })
  group: string;

  @ApiProperty({ example: 'Current city', description: 'User current city' })
  @Column({ name: 'current_city', type: 'varchar', nullable: true })
  currentCity: string;

  @ApiProperty({ example: 'URL', description: ' User Avatar' })
  @Column({ name: 'avatar', type: 'varchar' })
  avatar: string;

  @ApiProperty({ example: 'Full Stack', description: 'Field of internship' })
  @Column({ name: 'field_internship', type: 'varchar', nullable: true })
  fieldOfInternship: string;

  @ApiProperty({ example: 'Full Stack', description: ' User Avatar' })
  @Column({ name: 'internship_stream', type: 'varchar', nullable: true })
  nameInternshipStream: string;

  @ApiProperty({ example: false, description: 'Is verified user' })
  @Column({ name: 'verified', type: 'boolean', default: false })
  verified: boolean;

  @ApiProperty({ example: false, description: 'Is passed test' })
  @Column({ name: 'is_passed_test', type: 'boolean', default: false })
  isPassedTest: boolean;

  @ApiProperty({ example: false, description: 'Is passed technical task' })
  @Column({ name: 'is_passed_technical_task', type: 'boolean', default: false })
  isPassedTechnicalTask: boolean;

  @ApiProperty({ example: 'Verify token', description: 'Verify token' })
  @Column({ name: 'verify_token', type: 'varchar', default: null })
  verifyToken: string;

  @ManyToMany(() => Role, (roles) => roles.users, { cascade: true })
  @JoinTable()
  roles: Role[];
}
