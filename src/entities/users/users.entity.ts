import { ApiProperty } from '@nestjs/swagger';
import { MyBaseEntity } from '@utils/base.entity';
import { Matches, MinLength } from 'class-validator';
import { Column, Entity, JoinTable, ManyToMany, Unique } from 'typeorm';
import { Role } from './role.entity';

@Entity('users')
export class User extends MyBaseEntity {
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

  @ApiProperty({ example: 'URL', description: 'User avatar' })
  @Column({ name: 'avatar', type: 'varchar', nullable: true })
  avatar: string;

  @ApiProperty({
    example: '1x2y3z4aBcDeFgHiJkLmNpQrStUvWxYz',
    description: 'Avatar id in google drive',
  })
  @Column({ name: 'file_id', type: 'varchar', nullable: true })
  fileId: string;

  @ApiProperty({ example: 'Mark', description: 'User First name' })
  @Column({ name: 'first_name', type: 'varchar', nullable: true })
  firstName: string;

  @ApiProperty({ example: 'Spencer', description: 'User Last name' })
  @Column({ name: 'last_name', type: 'varchar', nullable: true })
  lastName: string;

  @ApiProperty({ example: 'contactPhone', description: 'User contact phone' })
  @Column({ name: 'phone', type: 'varchar', nullable: true })
  @Unique(['phone'])
  @Matches(/^(?:\+\d{1,3}\d{3,14})$/, {
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

  @ApiProperty({ example: 'Current city', description: 'User current city' })
  @Column({ name: 'current_city', type: 'varchar', nullable: true })
  currentCity: string;

  @ApiProperty({
    example: 'https://www.linkedin.com/in/user/',
    description: 'User linkedin url',
    required: true,
  })
  @Column({ name: 'linkedin_url', type: 'varchar', nullable: true })
  public linkedinUrl: string;

  @ApiProperty({
    example: 'Beginner/Elementary(A1)',
    description: 'English level',
    required: true,
  })
  @Column({ name: 'english_level', type: 'varchar', nullable: true })
  englishLevel: string;

  @ApiProperty({
    example: 'resume url',
    description: 'Resume url',
    required: true,
  })
  @Column({ name: 'resume_url', type: 'varchar', nullable: true })
  resumeUrl: string;

  @ApiProperty({
    example: 'documentation tets url',
    description: 'Documentation tets url',
  })
  @Column({ name: 'documentation_tets_url', type: 'varchar', nullable: true })
  documentationTetsUrl: string;

  @ApiProperty({
    example: "Because I'm the best",
    description: 'Why are you the best candidate? What motivates you?',
    required: true,
  })
  @Column({ name: 'why_are_you', type: 'varchar', nullable: true })
  whyAreYou: string;

  @ApiProperty({
    example: 'BackEnd, NestJS, Git',
    description:
      'What projects/tasks/technologies/tools are you interested in and would like to learn during your internship?',
    required: true,
  })
  @Column({ name: 'what_projects_interested', type: 'varchar', nullable: true })
  whatProjectsInterested: string;

  @ApiProperty({
    example: 'Example of projects',
    description:
      'Do you have projects that you have worked on before and how did you succeed in completing them?',
    required: true,
  })
  @Column({ name: 'have_projects', type: 'varchar', nullable: true })
  haveProjects: string;

  @ApiProperty({
    example: 'Manager',
    description: 'Your education and specialization before IT?',
    required: true,
  })
  @Column({ name: 'education', type: 'varchar', nullable: true })
  education: string;

  @ApiProperty({
    example: '500 USD',
    description: 'Specify the desired salary',
    required: true,
  })
  @Column({ name: 'desired_salary', type: 'varchar', nullable: true })
  desiredSalary: string;

  @ApiProperty({
    example: true,
    description: 'Data processing consent',
    required: true,
  })
  @Column({
    name: 'is_data_processing_consent',
    type: 'boolean',
    default: false,
  })
  isDataProcessingConsent: boolean;

  @ApiProperty({
    example: 'Group 47',
    description: 'Group in which the user studied',
  })
  @Column({ name: 'group', type: 'varchar', nullable: true })
  group: string;

  @ApiProperty({
    example: 'Full Stack',
    description: 'Direction in which the user was trained',
  })
  @Column({ name: 'direction', type: 'varchar', nullable: true })
  direction: string;

  @ApiProperty({ example: 1, description: 'Stream internship id' })
  @Column({
    name: 'stream_id',
    type: 'integer',
    nullable: true,
  })
  streamId: number;

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

  @ApiProperty({ example: false, description: 'Is there a stream' })
  @Column({ name: 'is_label_stream', type: 'boolean', default: false })
  isLabelStream: boolean;

  @ManyToMany(() => Role, (roles) => roles.users, { cascade: true })
  @JoinTable()
  roles: Role[];
}
