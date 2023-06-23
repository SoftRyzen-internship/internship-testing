import { ApiProperty } from '@nestjs/swagger';

export class ResponseDashboardDto {
  @ApiProperty({ example: 4, description: 'Total number of directions' })
  totalNumberOfDirections: number;

  @ApiProperty({
    example: {
      QA: 1,
      PM: 1,
      FrontEnd: 8,
      BackEnd: 2,
    },
    description: 'The number of students by direction',
  })
  theNumberOfStudentsByDirection: IStudentsByDirection;

  @ApiProperty({ example: 30, description: 'How many candidates registered' })
  howManyCandidatesRegistered: number;

  @ApiProperty({
    example: 25,
    description: 'How many candidates passed the test',
  })
  howManyCandidatesPassedTheTest: number;

  @ApiProperty({
    example: 15,
    description: 'How many candidates passed the technical task',
  })
  howManyCandidatesPassedTheTechnicalTask: number;

  @ApiProperty({
    example: 15,
    description: 'How many technical tasks are checked',
  })
  howManyTechnicalTasksAreChecked: number;
}

export interface IStudentsByDirection {
  [key: string]: string | number;
}
