import { ApiProperty } from '@nestjs/swagger';
import * as regex from '@src/constants/regex-expressions';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';

export class UserDto {
  @ApiProperty({
    example: 'Mark',
    description: 'User First name',
    required: true,
  })
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  public firstName: string;

  @ApiProperty({
    example: 'Spencer',
    description: 'User Last name',
    required: true,
  })
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  public lastName: string;

  @ApiProperty({
    example: '+380XXXXXXXXX',
    description: 'User contact phone',
    required: true,
  })
  @IsPhoneNumber()
  @IsNotEmpty()
  public phone: string;

  @ApiProperty({
    example: 'https://t.me/name',
    description: 'User Telegram contact',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(regex.telegramRegex, {
    message: 'Telegram contact must be in the format "t.me/name"',
  })
  public telegramContact: string;

  @ApiProperty({
    example: 'Current city',
    description: 'User current city',
    required: true,
  })
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  public currentCity: string;

  @ApiProperty({
    example: 'Frontend',
    description: 'Direction',
    required: true,
  })
  @IsOptional()
  @ValidateIf((object, value) => value !== undefined && value !== null)
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  public direction: string;

  @ApiProperty({
    example: 'https://www.linkedin.com/in/user/',
    description: 'User linkedin url',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(regex.linkRegex, {
    message: 'This should have been a link',
  })
  public linkedinUrl: string;

  @ApiProperty({
    example: 'Beginner/Elementary(A1)',
    description: 'English level',
    required: true,
  })
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  public englishLevel: string;

  @ApiProperty({
    example: 'https://my-resume.com',
    description: 'Resume url',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(regex.linkRegex, {
    message: 'This should have been a link',
  })
  public resumeUrl: string;

  @ApiProperty({
    example: "Because I'm the best",
    description: 'Why are you the best candidate? What motivates you?',
    required: true,
  })
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  public whyAreYou: string;

  @ApiProperty({
    example: 'BackEnd, NestJS, Git',
    description:
      'What projects/tasks/technologies/tools are you interested in and would like to learn during your internship?',
    required: true,
  })
  @Transform(({ value }) => value.trim())
  @IsString()
  public whatProjectsInterested: string;

  @ApiProperty({
    example: 'Example of projects',
    description:
      'Do you have projects that you have worked on before and how did you succeed in completing them?',
    required: true,
  })
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  public haveProjects: string;

  @ApiProperty({
    example: 'Manager',
    description: 'Your education and specialization before IT?',
    required: true,
  })
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  public education: string;

  @ApiProperty({
    example: '500 USD',
    description: 'Specify the desired salary',
    required: true,
  })
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  public desiredSalary: string;

  @ApiProperty({
    example: true,
    description: 'Data processing consent',
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  public isDataProcessingConsent: boolean;

  @ApiProperty({
    example: 'https://my-docs.herokuapp.com/api/docs',
    description: 'Documentation url',
    required: true,
  })
  @ValidateIf((object, value) => value !== undefined)
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @Matches(regex.linkRegex, {
    message: 'This should have been a link',
  })
  public documentationUrl?: string;
}

export class CandidateProgressUpdatesDto {
  @ApiProperty({
    example: false,
    description: 'You have received an invitation to an interview',
  })
  @IsOptional()
  @ValidateIf((object, value) => value !== undefined && value !== null)
  @IsBoolean()
  @IsNotEmpty()
  public isSendInterview?: boolean;

  @ApiProperty({
    example: false,
    description: 'Interview failed',
  })
  @IsOptional()
  @ValidateIf((object, value) => value !== undefined && value !== null)
  @IsBoolean()
  @IsNotEmpty()
  public isFailedInterview?: boolean;

  @ApiProperty({
    example: false,
    description: 'Interview success',
  })
  @IsOptional()
  @ValidateIf((object, value) => value !== undefined && value !== null)
  @IsBoolean()
  @IsNotEmpty()
  public isSuccessInterview?: boolean;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'Interview start date ',
  })
  @IsOptional()
  @ValidateIf((object, value) => value !== undefined && value !== null)
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  public startDateInterview?: Date;

  @ApiProperty({
    example: false,
    description: 'Received the offer',
  })
  @IsOptional()
  @ValidateIf((object, value) => value !== undefined && value !== null)
  @IsBoolean()
  @IsNotEmpty()
  public isOffer?: boolean;

  @ApiProperty({
    example: 'https://google-meet.com/',
    description: 'Meeting interview',
  })
  @IsOptional()
  @ValidateIf((object, value) => value !== undefined && value !== null)
  @Matches(regex.linkRegex, {
    message: 'This should have been a link',
  })
  public meetingInterviewUrl: string;
}
