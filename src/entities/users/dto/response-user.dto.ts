import { ApiProperty } from '@nestjs/swagger';

export class StreamsHistoryResponseDto {
  @ApiProperty({ example: 1, description: 'Stream internship id' })
  streamId: number;

  @ApiProperty({
    example: 'Stream Winter 2023',
    description: 'Internship Stream',
  })
  internshipStreamName: string;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'Start date of internship stream',
  })
  startDate: Date;

  @ApiProperty({
    example: 'Frontend',
    description: 'Direction in which the user was trained',
  })
  direction: string;
}

export class ResponseCurrentDto {
  @ApiProperty({ example: 1, description: 'Unique id user`s' })
  public id: number;

  @ApiProperty({
    example: '2023-06-13T14:58:05.590Z',
    description: 'Create At',
  })
  public createAt: string;

  @ApiProperty({
    example: '2023-06-13T14:58:05.590Z',
    description: 'Update At',
  })
  public updateAt: string;

  @ApiProperty({ example: 'email', description: 'User  email' })
  public email: string;

  @ApiProperty({ example: 'URL', description: 'User avatar' })
  public avatar: string;

  @ApiProperty({ example: 'Mark', description: 'User First name' })
  public firstName: string;

  @ApiProperty({ example: 'Spencer', description: 'User Last name' })
  public lastName: string;

  @ApiProperty({ example: 'contactPhone', description: 'User contact phone' })
  public phone: string;

  @ApiProperty({
    example: 'Telegram contact',
    description: 'User Telegram contact',
  })
  public telegramContact: string;

  @ApiProperty({ example: 'Current city', description: 'User current city' })
  public currentCity: string;

  @ApiProperty({
    example: 'https://www.linkedin.com/in/user/',
    description: 'User linkedin url',
    required: true,
  })
  public linkedinUrl: string;

  @ApiProperty({
    example: 'Beginner/Elementary(A1)',
    description: 'English level',
    required: true,
  })
  public englishLevel: string;

  @ApiProperty({
    example: 'resume url',
    description: 'Resume url',
    required: true,
  })
  public resumeUrl: string;

  @ApiProperty({
    example: 'https://my-documentation.herokuapp.com/api/docs',
    description: 'Documentation tets url',
  })
  public documentationUrl: string;

  @ApiProperty({
    example: "Because I'm the best",
    description: 'Why are you the best candidate? What motivates you?',
    required: true,
  })
  public whyAreYou: string;

  @ApiProperty({
    example: 'Backend, NestJS, Git',
    description:
      'What projects/tasks/technologies/tools are you interested in and would like to learn during your internship?',
    required: true,
  })
  public whatProjectsInterested: string;

  @ApiProperty({
    example: 'Example of projects',
    description:
      'Do you have projects that you have worked on before and how did you succeed in completing them?',
    required: true,
  })
  public haveProjects: string;

  @ApiProperty({
    example: 'Manager',
    description: 'Your education and specialization before IT?',
    required: true,
  })
  public education: string;

  @ApiProperty({
    example: '500 USD',
    description: 'Specify the desired salary',
    required: true,
  })
  public desiredSalary: string;

  @ApiProperty({
    example: true,
    description: 'Data processing consent',
    required: true,
  })
  public isDataProcessingConsent: boolean;

  @ApiProperty({
    example: 'Frontend',
    description: 'Direction in which the user was trained',
  })
  public direction: string;

  @ApiProperty({ example: 1, description: 'Stream internship id' })
  public streamId: number;

  @ApiProperty({ example: false, description: 'Is verified user' })
  public verified: boolean;

  @ApiProperty({ example: false, description: 'Is passed test' })
  public isPassedTest: boolean;

  @ApiProperty({ example: 65, description: 'Score test' })
  public scoreTest: number;

  @ApiProperty({ example: false, description: 'Is sent test' })
  public isSentTest: boolean;

  @ApiProperty({ example: false, description: 'Is start test' })
  public isStartTest: boolean;

  @ApiProperty({ example: false, description: 'Is passed technical task' })
  public isPassedTechnicalTask: boolean;

  @ApiProperty({ example: false, description: 'Is sent technical task' })
  public isSentTechnicalTask: boolean;

  @ApiProperty({ example: false, description: 'Is there a stream' })
  public isLabelStream: boolean;

  @ApiProperty({ example: false, description: 'Did you have an internship?' })
  public isHaveInternship: boolean;

  @ApiProperty({ example: ['user', 'admin'], description: 'User roles' })
  public roles: string[];

  @ApiProperty({
    type: () => [StreamsHistoryResponseDto],
  })
  public streamsHistory: StreamsHistoryResponseDto[];
}

export class ResponseCurrentUserDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'User refresh token"',
  })
  public refreshToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'User success token',
  })
  public accessToken: string;

  @ApiProperty({ type: () => ResponseCurrentDto })
  user: ResponseCurrentDto;
}
