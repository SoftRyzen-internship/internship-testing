import { ApiProperty } from '@nestjs/swagger'
import { Matches, MinLength } from 'class-validator'
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique,CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { Direction, Group } from './enums/group.enum'



@Entity('users')
export class User extends BaseEntity {

  @ApiProperty({example: 'id number', description: " User  id number"})
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({example: 'Mark', description: " User First name"})
  @Column({ name: 'firstName', type: 'varchar' })
  firstName: string

  @ApiProperty({example: 'Spencer', description: " User Last name"})
  @Column({ name: 'lastName', type: 'varchar' })
  lastName: string

  @ApiProperty({example: 'email', description: " User  email"})
  @Column({ name: 'email', type: 'varchar' })
  @Unique(['email'])
  email: string

  @ApiProperty({example: 'User password', description: " User  password"})
  @Column({ name: 'password', type: 'varchar' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
    message: 'Password must contain letters and numbers',
  })
  password: string

  @ApiProperty({example: 'contactPhone', description: "User contact phone"})
  @Column({ name: 'contactPhone', type: 'varchar' })
  @Unique(['contactPhone'])
@Matches(/^\+380\d{9}$/, { message: 'Contact phone must be in the format "+380XXXXXXXXX"' })
  contactPhone: string

  @ApiProperty({example: 'Telegram contact', description: "User Telegram contact"})
  @Column({ name: 'telegramContact', type: 'varchar' })
@Matches(/^t.me\/\w+$/, { message: 'Telegram contact must be in the format "t.me/name"' })
  telegramContact: string

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

  @ApiProperty({example: 'Current city', description: "User current city"})
  @Column({ name: 'currentCity', type: 'varchar' })
  currentCity: string

  @ApiProperty({example: 'URL', description: " User Avatar"})
    @Column({ name: 'avatar', type: 'varchar' })
    avatar: string

    @ApiProperty({example: 'Full Stack', description: " User Avatar"})
    @Column({ name: 'currentThread', type: 'varchar' })
    currentThread: string

    @ApiProperty({ example: 'Access token', description: 'User access token' })
  @Column({ name: 'accessToken', type: 'varchar', nullable: true }) 
  accessToken: string;

  @ApiProperty({ example: 'Refresh token', description: 'User access token' })
  @Column({ name: 'refreshToken', type: 'varchar', nullable: true })
  refreshToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}




