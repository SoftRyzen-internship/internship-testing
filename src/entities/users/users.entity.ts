import { ApiProperty } from '@nestjs/swagger'
import { Matches, MinLength } from 'class-validator'
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm'



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

}


