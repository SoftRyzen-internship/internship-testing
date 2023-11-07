import { ApiProperty } from '@nestjs/swagger';
import { EDifficulty } from '../../../enums/difficulty.enum';

export class CreateQuestionDto {
  @ApiProperty({
    example: 'What is Node.js?',
    description: 'Text of the question',
  })
  public questionText: string;

  @ApiProperty({
    example: '123',
    description: 'Optional code associated with the question',
  })
  public code?: string;

  @ApiProperty({
    example: 'JS',
    description: 'Block associated with the question',
  })
  public blockQuestions: string;

  @ApiProperty({
    type: 'enum',
    enum: EDifficulty,
    description: 'Difficulty level of the question',
  })
  public difficulty: EDifficulty;

  @ApiProperty({ example: 3, description: 'Points assigned to the question' })
  public points: number;
}

export class ResponseCreateQuestionDto extends CreateQuestionDto {
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
}

export class ResponseDeleteQuestionsDto {
  @ApiProperty({ example: 'Question deleted' })
  public message: string;
}
