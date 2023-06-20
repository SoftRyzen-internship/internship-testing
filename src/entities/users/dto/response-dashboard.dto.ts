import { ApiProperty } from '@nestjs/swagger';

export class ResponseDashboardDto {
  @ApiProperty({ example: 4, description: 'Total number of directions' })
  total_number_of_directions: number;

  @ApiProperty({
    example: {
      QA: 1,
      PM: 1,
      FrontEnd: 8,
      BackEnd: 2,
    },
    description: 'The number of students by direction',
  })
  the_number_of_students_by_direction: IStudentsByDirection;

  @ApiProperty({ example: 30, description: 'How many candidates registered' })
  how_many_candidates_registered: number;

  @ApiProperty({
    example: 25,
    description: 'How many candidates passed the test',
  })
  how_many_candidates_passed_the_test: number;

  @ApiProperty({
    example: 15,
    description: 'How many candidates passed the technical task',
  })
  how_many_candidates_passed_the_technical_task: number;

  @ApiProperty({
    example: 15,
    description: 'How many technical tasks are checked',
  })
  how_many_technical_tasks_are_checked: number;
}

export interface IStudentsByDirection {
  [key: string]: string | number;
}
