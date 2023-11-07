import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAnswerDto {
  @ApiProperty({
    example: 'Cascading Style Sheets',
    description: 'Question answer',
  })
  @IsString()
  @IsNotEmpty()
  public answer: string;

  @ApiProperty({
    example: true,
    description: 'Is the answer correct?',
  })
  @IsBoolean()
  public isRight: boolean;

  @ApiProperty({ example: 1, description: 'Question id' })
  @IsNumber()
  @IsNotEmpty()
  public questionId: number;
}

export class ResponseAnswerDto extends CreateAnswerDto {
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

export class ResponseAnswersDto {
  @ApiProperty({ example: 1, description: 'Unique id' })
  public id: number;

  @ApiProperty({
    example: 'Cascading Style Sheets',
    description: 'Question answer',
  })
  public answer: string;
}

export class ResponseDeleteAnswerDto {
  @ApiProperty({ example: 'Answer deleted' })
  public message: string;
}
