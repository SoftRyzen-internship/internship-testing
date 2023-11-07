import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class UpdateTestDto {
  @ApiProperty({
    example: [1, 2, 5, 8, 7, 6, 9, 4],
    description: 'Answers ids',
  })
  @IsArray()
  public answersIds: number[];
}

export class ResponseTestQuestionBlockDto {
  @ApiProperty({ example: 'JS', description: 'Block name' })
  public blockName: string;

  @ApiProperty({ example: 15, description: 'Number of questions' })
  public numberOfQuestions: number;

  @ApiProperty({ example: 10, description: 'Correct questions' })
  public numberOfCorrectAnswers: number;
}

export class ResponseTestDto {
  @ApiProperty({ example: 1, description: 'Unique id test`s' })
  id: number;

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

  @ApiProperty({
    example: 'Stream Winter 2023',
    description: 'Internship Stream',
  })
  public internshipStream: string;

  @ApiProperty({
    example: 'Frontend',
    description: 'Direction in which the user was trained',
  })
  public direction: string;

  @ApiProperty({ example: 1, description: 'Stream number' })
  public streamNumber: number;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'Availability start date',
  })
  public startDate: string;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'Availability end date',
  })
  public endDate: string;

  @ApiProperty({ example: 60, description: 'Test time' })
  public testTime: string;

  @ApiProperty({
    example: { easy: 5, medium: 10, hard: 5 },
    description: 'Number of questions per difficulty level',
  })
  public questionDifficulty: any;

  @ApiProperty({
    type: [ResponseTestQuestionBlockDto],
  })
  public questionBlocks: ResponseTestQuestionBlockDto[];

  @ApiProperty({
    example: null,
    description: 'Test results',
  })
  public testResults: ResponseTestQuestionBlockDto[];

  @ApiProperty({
    example: null,
    description: 'Answers ids',
  })
  public answersId: number[];

  @ApiProperty({ example: 100, description: 'Number of questions in the test' })
  public numberOfQuestions: number;

  @ApiProperty({ example: 85, description: 'Passing score' })
  public passingScore: number;

  @ApiProperty({ example: 85, description: 'Result of correct answers' })
  public correctAnswers: number;

  @ApiProperty({ example: false, description: 'Did you pass the test?' })
  public isPassTest: boolean;

  @ApiProperty({ example: 1, description: 'Owner id' })
  public owner: number;
}

export class ResponseUpdateTestDto {
  @ApiProperty({ example: 1, description: 'Unique id test`s' })
  id: number;

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

  @ApiProperty({
    example: 'Stream Winter 2023',
    description: 'Internship Stream',
  })
  public internshipStream: string;

  @ApiProperty({
    example: 'Frontend',
    description: 'Direction in which the user was trained',
  })
  public direction: string;

  @ApiProperty({ example: 1, description: 'Stream number' })
  public streamNumber: number;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'Availability start date',
  })
  public startDate: string;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'Availability end date',
  })
  public endDate: string;

  @ApiProperty({ example: 60, description: 'Test time' })
  public testTime: string;

  @ApiProperty({
    example: { easy: 5, medium: 10, hard: 5 },
    description: 'Number of questions per difficulty level',
  })
  public questionDifficulty: any;

  @ApiProperty({
    type: [ResponseTestQuestionBlockDto],
  })
  public questionBlocks: ResponseTestQuestionBlockDto[];

  @ApiProperty({
    type: [ResponseTestQuestionBlockDto],
  })
  public testResults: ResponseTestQuestionBlockDto[];

  @ApiProperty({ example: 100, description: 'Number of questions in the test' })
  public numberOfQuestions: number;

  @ApiProperty({ example: 85, description: 'Passing score' })
  public passingScore: number;

  @ApiProperty({ example: 85, description: 'Result of correct answers' })
  public correctAnswers: number;

  @ApiProperty({ example: false, description: 'Did you pass the test?' })
  public isPassTest: boolean;

  @ApiProperty({ example: 1, description: 'Owner id' })
  public owner: number;
}

export class ResponseStartTestDto {
  @ApiProperty({ example: 'Test started' })
  message: string;
}
