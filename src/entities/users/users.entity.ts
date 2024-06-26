import { ApiProperty } from '@nestjs/swagger';
import { Matches, MinLength } from 'class-validator';
import { Column, Entity, JoinTable, ManyToMany, Unique } from 'typeorm';

import { MyBaseEntity } from '@entities/base.entity';
import { RoleEntity } from '@entities/roles/role.entity';
import {
  LINK_REGEX,
  PASSWORDS_REGEX,
  PHONE_REGEX,
  TELEGRAM_REGEX,
} from '@src/constants/constants';

@Entity('users')
export class UserEntity extends MyBaseEntity {
  @ApiProperty({ example: 'email', description: 'User  email' })
  @Column({ name: 'email', type: 'varchar' })
  @Unique(['email'])
  public email: string;

  @ApiProperty({ example: 'User password', description: 'User  password' })
  @Column({ name: 'password', type: 'varchar', nullable: true })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(PASSWORDS_REGEX, {
    message: 'Password must contain letters and numbers',
  })
  public password: string;

  @ApiProperty({ example: 'URL', description: 'User avatar' })
  @Column({ name: 'avatar', type: 'varchar', nullable: true })
  public avatar: string;

  @ApiProperty({
    example: '1x2y3z4aBcDeFgHiJkLmNpQrStUvWxYz',
    description: 'Avatar id in google drive',
  })
  @Column({ name: 'file_id', type: 'varchar', nullable: true })
  public fileId: string;

  @ApiProperty({ example: 'Mark', description: 'User First name' })
  @Column({ name: 'first_name', type: 'varchar', nullable: true })
  public firstName: string;

  @ApiProperty({ example: 'Spencer', description: 'User Last name' })
  @Column({ name: 'last_name', type: 'varchar', nullable: true })
  public lastName: string;

  @ApiProperty({ example: 'contactPhone', description: 'User contact phone' })
  @Column({ name: 'phone', type: 'varchar', nullable: true })
  @Matches(PHONE_REGEX, {
    message: 'Contact phone must be in the format "+380XXXXXXXXX"',
  })
  public phone: string;

  @ApiProperty({
    example: 'Telegram contact',
    description: 'User Telegram contact',
  })
  @Column({ name: 'telegram_contact', type: 'varchar', nullable: true })
  @Matches(TELEGRAM_REGEX, {
    message: 'Telegram contact must be in the format "t.me/name"',
  })
  public telegramContact: string;

  @ApiProperty({ example: 'Current city', description: 'User current city' })
  @Column({ name: 'current_city', type: 'varchar', nullable: true })
  public currentCity: string;

  @ApiProperty({
    example: 'https://www.linkedin.com/in/user/',
    description: 'User linkedin url',
    required: true,
  })
  @Column({ name: 'linkedin_url', type: 'varchar', nullable: true })
  @Matches(LINK_REGEX, {
    message: 'This should have been a link',
  })
  public linkedinUrl: string;

  @ApiProperty({
    example: 'Beginner/Elementary(A1)',
    description: 'English level',
    required: true,
  })
  @Column({ name: 'english_level', type: 'varchar', nullable: true })
  public englishLevel: string;

  @ApiProperty({
    example: 'resume url',
    description: 'Resume url',
    required: true,
  })
  @Column({ name: 'resume_url', type: 'varchar', nullable: true })
  @Matches(LINK_REGEX, {
    message: 'This should have been a link',
  })
  public resumeUrl: string;

  @ApiProperty({
    example: 'https://my-documentation.herokuapp.com/api/docs',
    description: 'Documentation tets url',
  })
  @Column({ name: 'documentation_url', type: 'varchar', nullable: true })
  @Matches(LINK_REGEX, {
    message: 'This should have been a link',
  })
  public documentationUrl: string;

  @ApiProperty({
    example: 'https://google-meet.com/',
    description: 'Meeting interview',
  })
  @Column({ name: 'meeting_interview_url', type: 'varchar', nullable: true })
  @Matches(LINK_REGEX, {
    message: 'This should have been a link',
  })
  public meetingInterviewUrl: string;

  @ApiProperty({
    example: "Because I'm the best",
    description: 'Why are you the best candidate? What motivates you?',
    required: true,
  })
  @Column({ name: 'why_are_you', type: 'varchar', nullable: true })
  public whyAreYou: string;

  @ApiProperty({
    example: 'BackEnd, NestJS, Git',
    description:
      'What projects/tasks/technologies/tools are you interested in and would like to learn during your internship?',
    required: true,
  })
  @Column({ name: 'what_projects_interested', type: 'varchar', nullable: true })
  public whatProjectsInterested: string;

  @ApiProperty({
    example: 'Example of projects',
    description:
      'Do you have projects that you have worked on before and how did you succeed in completing them?',
    required: true,
  })
  @Column({ name: 'have_projects', type: 'varchar', nullable: true })
  public haveProjects: string;

  @ApiProperty({
    example: 'Manager',
    description: 'Your education and specialization before IT?',
    required: true,
  })
  @Column({ name: 'education', type: 'varchar', nullable: true })
  public education: string;

  @ApiProperty({
    example: '500 USD',
    description: 'Specify the desired salary',
    required: true,
  })
  @Column({ name: 'desired_salary', type: 'varchar', nullable: true })
  public desiredSalary: string;

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
  public isDataProcessingConsent: boolean;

  @ApiProperty({
    example: 'Frontend',
    description: 'Direction in which the user was trained',
  })
  @Column({ name: 'direction', type: 'varchar', nullable: true })
  public direction: string;

  @ApiProperty({ example: 1, description: 'Stream internship id' })
  @Column({
    name: 'stream_id',
    type: 'integer',
    nullable: true,
  })
  public streamId: number;

  @ApiProperty({
    example: [
      {
        streamId: 1,
        internshipStreamName: 'Stream 1',
        startDate: '2023-11-01T00:00:00.000Z',
        direction: 'Frontend',
      },
    ],
    description: 'Info streams',
  })
  @Column({
    name: 'streams_info',
    type: 'jsonb',
    nullable: true,
  })
  public streamsHistory: string;

  @ApiProperty({ example: false, description: 'Is verified user' })
  @Column({ name: 'verified', type: 'boolean', default: false })
  public verified: boolean;

  @ApiProperty({ example: false, description: 'Is passed test' })
  @Column({ name: 'is_passed_test', type: 'boolean', default: false })
  public isPassedTest: boolean;

  @ApiProperty({ example: 65, description: 'Score test' })
  @Column({ name: 'score_test', type: 'integer', default: null })
  public scoreTest: number;

  @ApiProperty({ example: false, description: 'Is sent test' })
  @Column({ name: 'is_sent_test', type: 'boolean', default: false })
  public isSentTest: boolean;

  @ApiProperty({ example: false, description: 'Is start test' })
  @Column({ name: 'is_start_test', type: 'boolean', default: false })
  public isStartTest: boolean;

  @ApiProperty({ example: false, description: 'Is passed technical task' })
  @Column({ name: 'is_passed_technical_task', type: 'boolean', default: false })
  public isPassedTechnicalTask: boolean;

  @ApiProperty({ example: false, description: 'Is sent technical task' })
  @Column({
    name: 'is_sent_technical_task',
    type: 'boolean',
    default: false,
  })
  public isSentTechnicalTask: boolean;

  @ApiProperty({
    example: false,
    description: 'You have received an invitation to an interview',
  })
  @Column({
    name: 'is_send_interview',
    type: 'boolean',
    default: false,
  })
  public isSendInterview: boolean;

  @ApiProperty({
    example: false,
    description: 'Interview failed',
  })
  @Column({
    name: 'is_failed_interview',
    type: 'boolean',
    default: false,
  })
  public isFailedInterview: boolean;

  @ApiProperty({
    example: false,
    description: 'Interview failed',
  })
  @Column({
    name: 'is_success_interview',
    type: 'boolean',
    default: false,
  })
  public isSuccessInterview: boolean;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'Interview start date ',
  })
  @Column({ name: 'start_date_interview', type: 'timestamp', nullable: true })
  public startDateInterview: Date;

  @ApiProperty({
    example: false,
    description: 'Received the offer',
  })
  @Column({
    name: 'is_offer',
    type: 'boolean',
    default: false,
  })
  public isOffer: boolean;

  @ApiProperty({ example: 'Verify token', description: 'Verify token' })
  @Column({ name: 'verify_token', type: 'varchar', default: null })
  public verifyToken: string;

  @ApiProperty({ example: false, description: 'Is there a stream' })
  @Column({ name: 'is_label_stream', type: 'boolean', default: false })
  public isLabelStream: boolean;

  @ApiProperty({ example: false, description: 'Did you have an internship?' })
  @Column({ name: 'is_have_internship', type: 'boolean', default: false })
  public isHaveInternship: boolean;

  @ApiProperty({ example: false, description: 'Is complete data user' })
  @Column({ name: 'is_complect_data', type: 'boolean', default: false })
  public isCompleteData: boolean;

  @ApiProperty({ example: 'Refresh token', description: ' Refresh  token' })
  @Column({ name: 'refresh_token', type: 'varchar', nullable: true })
  public refreshToken: string;

  @ApiProperty({ example: '01.01.2024', description: 'Registration date' })
  @Column({ name: 'registration_date', type: 'varchar', nullable: true })
  public registrationDate: string;

  @ManyToMany(() => RoleEntity, (roles) => roles.users, { onDelete: 'CASCADE' })
  @JoinTable()
  public roles: RoleEntity[];
}
