import { ApiProperty } from '@nestjs/swagger';
import { IsEmail,  Matches, MinLength } from 'class-validator';
import {  Column, Unique } from 'typeorm'
import { Direction, Group } from '@entities/users/enums/group.enum';


export class RegisterUserDto {
    @ApiProperty({example: 'Mark', description: " User First name"})
    @Column({ name: 'firstName', type: 'varchar' })
    firstName: string
  
    @ApiProperty({example: 'Spencer', description: " User Last name"})
    @Column({ name: 'lastName', type: 'varchar' })
    lastName: string
  
    @ApiProperty({example: 'email', description: " User  email"})
    @Column({ name: 'email', type: 'varchar' })
    @IsEmail()
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
  phone: string

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
    example: 'Group A',
    description: 'Group in which the user studied',
    enum: Group,
  })
  @Column({ type: 'enum', enum: Group })
  group: Group;

  @ApiProperty({example: 'Current city', description: "User current city"})
  @Column({ name: 'currentCity', type: 'varchar' })
  currentCity: string

}





