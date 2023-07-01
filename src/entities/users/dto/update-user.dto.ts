import { ApiProperty } from '@nestjs/swagger';
import * as regex from '@utils/regex-expressions';
import { IsBoolean, IsPhoneNumber, IsString, Matches } from 'class-validator';

export class UserDto {
  @ApiProperty({
    example: 'Mark',
    description: 'User First name',
    required: true,
  })
  @IsString()
  public firstName: string;

  @ApiProperty({
    example: 'Spencer',
    description: 'User Last name',
    required: true,
  })
  @IsString()
  public lastName: string;

  @ApiProperty({
    example: '+380XXXXXXXXX',
    description: 'User contact phone',
    required: true,
  })
  @IsPhoneNumber()
  public phone: string;

  @ApiProperty({
    example: 'Telegram contact',
    description: 'User Telegram contact',
    required: true,
  })
  @IsString()
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
  public currentCity: string;

  @ApiProperty({
    example: 'https://www.linkedin.com/in/user/',
    description: 'User linkedin url',
    required: true,
  })
  @IsString()
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
  public englishLevel: string;

  @ApiProperty({
    example: 'resume url',
    description: 'Resume url',
    required: true,
  })
  @IsString()
  @Matches(regex.linkRegex, {
    message: 'This should have been a link',
  })
  public resumeUrl: string;

  @ApiProperty({
    example: 'documentation tets url',
    description: 'Documentation tets url',
  })
  @IsString()
  @Matches(regex.linkRegex, {
    message: 'This should have been a link',
  })
  public documentationTetsUrl?: string;

  @ApiProperty({
    example: "Because I'm the best",
    description: 'Why are you the best candidate? What motivates you?',
    required: true,
  })
  @IsString()
  public whyAreYou: string;

  @ApiProperty({
    example: 'BackEnd, NestJS, Git',
    description:
      'What projects/tasks/technologies/tools are you interested in and would like to learn during your internship?',
    required: true,
  })
  @IsString()
  public whatProjectsInterested: string;

  @ApiProperty({
    example: 'Example of projects',
    description:
      'Do you have projects that you have worked on before and how did you succeed in completing them?',
    required: true,
  })
  @IsString()
  public haveProjects: string;

  @ApiProperty({
    example: 'Manager',
    description: 'Your education and specialization before IT?',
    required: true,
  })
  @IsString()
  public education: string;

  @ApiProperty({
    example: '500 USD',
    description: 'Specify the desired salary',
    required: true,
  })
  @IsString()
  public desiredSalary: string;

  @ApiProperty({
    example: true,
    description: 'Data processing consent',
    required: true,
  })
  @IsBoolean()
  public isDataProcessingConsent: boolean;

  @ApiProperty({
    example: 'FS43',
    description: 'Group in which the user studied',
    required: false,
  })
  @IsString()
  public group?: string;
}
