import { CreateAnswerDto } from '@entities/answers/dto/answers.dto';
import { ApiProperty } from '@nestjs/swagger';
import { EDifficulty } from '../../../enums/difficulty.enum';

export class CreateQuestionDto {
  @ApiProperty({
    example: 'What is CSS?',
    description: 'Text of the question',
  })
  public questionText: string;

  @ApiProperty({
    example: '123',
    description: 'Optional code associated with the question',
  })
  public code?: string;

  @ApiProperty({
    example: 1,
    description: 'Block question id',
  })
  public blockQuestionsId: number;

  @ApiProperty({ type: [CreateAnswerDto] })
  public answers: CreateAnswerDto[];

  @ApiProperty({
    type: 'enum',
    enum: EDifficulty,
    description: 'Difficulty level of the question',
  })
  public difficulty: EDifficulty;

  @ApiProperty({ example: 3, description: 'Points assigned to the question' })
  public points: number;
}

export class UpdateQuestionDto {
  @ApiProperty({
    example: 'What is CSS?',
    description: 'Text of the question',
  })
  public questionText: string;

  @ApiProperty({
    example: '123',
    description: 'Optional code associated with the question',
  })
  public code?: string;

  @ApiProperty({
    example: 1,
    description: 'Block question id',
  })
  public blockQuestionsId: number;

  @ApiProperty({
    type: 'enum',
    enum: EDifficulty,
    description: 'Difficulty level of the question',
  })
  public difficulty: EDifficulty;

  @ApiProperty({ example: 3, description: 'Points assigned to the question' })
  public points: number;
}

class ResponseAnswersForQuestionDto {
  @ApiProperty({ example: 1, description: 'Unique id' })
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

  @ApiProperty({ example: 'Answer 1' })
  public answer: string;

  @ApiProperty({ example: 'HTML/CSS' })
  public blockName: string;

  @ApiProperty({ example: true })
  public isRight: boolean;

  @ApiProperty({ example: 1 })
  public owner: number;
}

export class ResponseCreateQuestionDto {
  @ApiProperty({ example: 1, description: 'Unique id' })
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

  @ApiProperty({
    example: 'What is CSS?',
    description: 'Text of the question',
  })
  public questionText: string;

  @ApiProperty({
    example: '123',
    description: 'Optional code associated with the question',
  })
  public code?: string;

  @ApiProperty({
    example: 1,
    description: 'Block question id',
  })
  public blockQuestionsId: number;

  @ApiProperty({ type: [ResponseAnswersForQuestionDto] })
  public answers: ResponseAnswersForQuestionDto[];

  @ApiProperty({
    type: 'enum',
    enum: EDifficulty,
    description: 'Difficulty level of the question',
  })
  public difficulty: EDifficulty;

  @ApiProperty({ example: 3, description: 'Points assigned to the question' })
  public points: number;
}

export class ResponseGetQuestionDto {
  @ApiProperty({ example: 1, description: 'Unique id' })
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

  @ApiProperty({ example: 'Question 1' })
  public questionText: string;

  @ApiProperty({ example: 1 })
  public code: number;

  @ApiProperty({ example: [1, 2, 3, 4] })
  public answersId: number[];

  @ApiProperty({ example: 1 })
  public blockQuestionsId: number;

  @ApiProperty({ example: 'easy' })
  public difficulty: string;

  @ApiProperty({ example: 1 })
  public points: number;

  @ApiProperty({ example: 1 })
  public owner: number;

  @ApiProperty({ type: [ResponseAnswersForQuestionDto] })
  public answers: ResponseAnswersForQuestionDto[];
}

export class ResponseDeleteQuestionsDto {
  @ApiProperty({ example: 'Question deleted' })
  public message: string;
}
