import { ApiProperty } from '@nestjs/swagger';

export class ResponseDirectionsOfStreamDto {
  @ApiProperty({
    example: 1,
    description: 'Internship Stream Id',
  })
  public id: number;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'createAt',
  })
  public createAt: Date;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'updateAt',
  })
  public updateAt: Date;

  @ApiProperty({
    example: 'Frontend',
    description: 'Internship direction',
    required: true,
  })
  public direction: string;

  @ApiProperty({
    example:
      'Development of web interfaces, using modern frameworks and tools...',
    description: 'Direction description',
    required: true,
  })
  public description: string;

  @ApiProperty({
    example: ['Next.js', 'Tailwind', 'React', 'JavaScript', 'TypeScript'],
    description: 'Direction technologies',
    required: true,
  })
  public technologies: string[];

  @ApiProperty({ example: 1, description: 'Admin id' })
  public ownerId: number;

  @ApiProperty({ example: 'admin', description: 'Role' })
  public owner: string;

  @ApiProperty({
    example: 'https://www.description.com/direction',
    description: 'Description of the direction',
    required: true,
  })
  public descriptionDirectionUrl: string;
}

export class TestResponseCurrentUserDto {
  @ApiProperty({
    example: false,
    description: 'Has the test been sent?',
  })
  public isSent: boolean;

  @ApiProperty({
    example: false,
    description: 'Is start test',
  })
  public isStartTest: boolean;

  @ApiProperty({
    example: false,
    description: 'Is success test',
  })
  public isSuccess: boolean;

  @ApiProperty({
    example: '2023-07-12 16:03:20.157888',
    description: 'Start date of internship stream',
  })
  public startDate?: Date;

  @ApiProperty({
    example: '2023-07-12 16:03:20.157888',
    description: 'End date of internship stream',
  })
  public endDate?: Date;
}

export class TaskResponseCurrentUserDto {
  @ApiProperty({
    example: false,
    description: 'Start date of internship stream',
  })
  public isSent: boolean;

  @ApiProperty({
    example: false,
    description: 'Start date of internship stream',
  })
  public isSuccess: boolean;

  @ApiProperty({
    example: '25.07.2023 12:00',
    description: 'Start date of internship stream',
  })
  public deadlineDate: Date;
}

export class InterviewResponseCurrentUserDto {
  @ApiProperty({
    example: false,
    description: 'You have received an invitation to an interview',
  })
  public isSend: boolean;

  @ApiProperty({
    example: false,
    description: 'Interview failed',
  })
  public isFailed: boolean;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'Interview start date ',
  })
  public startDate: Date;

  @ApiProperty({
    example: 'https://google-meet.com/',
    description: 'Meeting interview',
  })
  public meetingInterviewUrl: string;
}

export class OfferResponseCurrentUserDto {
  @ApiProperty({
    example: false,
    description: 'Received the offer',
  })
  public isOffer: boolean;
}
export class ResponseStreamDto {
  @ApiProperty({
    example: 1,
    description: 'Internship Stream Id',
  })
  public id: number;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'createAt',
  })
  public createAt: Date;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'updateAt',
  })
  public updateAt: Date;

  @ApiProperty({
    example: 'Stream Winter 2023',
    description: 'Internship Stream',
  })
  public internshipStreamName: string;

  @ApiProperty({ example: [1, 2, 3, 4, 5], description: 'Directions id' })
  public directionsIds: number[];

  @ApiProperty({
    example: 1,
    description: 'Internship number',
  })
  public number: number;

  @ApiProperty({
    example: 1,
    description: 'Admin id',
  })
  public ownerId: number;

  @ApiProperty({
    example: 'admin',
    description: 'Role owner',
  })
  public owner: string;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'Start date of internship stream',
  })
  public startDate: Date;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'End date of internship stream',
  })
  public endDate: Date;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'Start date of testing',
  })
  public startDateTesting: Date;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'End date of testing',
  })
  public endDateTesting: Date;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'Start date of technical test',
  })
  public startDateTechnicalTest: Date;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'End date of technical test',
  })
  public endDateTechnicalTest: Date;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'Start date of online interview',
  })
  public startDateOnlineInterview: Date;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'End date of online interview',
  })
  public endDateOnlineInterview: Date;

  @ApiProperty({
    example: true,
    description: 'Is active stream',
  })
  public isActive: boolean;

  @ApiProperty({
    example: true,
    description: 'Is open register',
  })
  public isOpenRegister: boolean;

  @ApiProperty({ example: false, description: 'Is complete data user' })
  public isCompleteData: boolean;

  @ApiProperty({ example: 800, description: 'Average test score' })
  public averageTestScore: number;

  @ApiProperty({ example: 5, description: 'Did not complete the internship' })
  public notCompleteInternship: number;

  @ApiProperty({ example: 10, description: 'Completed an internship' })
  public completeInternship: number;

  @ApiProperty({ type: () => TestResponseCurrentUserDto })
  public test: TestResponseCurrentUserDto;

  @ApiProperty({ type: () => TaskResponseCurrentUserDto })
  public task: TaskResponseCurrentUserDto;

  @ApiProperty({ type: () => InterviewResponseCurrentUserDto })
  public interview: InterviewResponseCurrentUserDto;

  @ApiProperty({ type: () => OfferResponseCurrentUserDto })
  public isOffer: OfferResponseCurrentUserDto;
}

export class ResponseActiveStreamDto extends ResponseStreamDto {
  @ApiProperty({
    type: [ResponseDirectionsOfStreamDto],
  })
  public directions: ResponseDirectionsOfStreamDto[];
}
