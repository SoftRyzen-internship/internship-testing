import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateQuestionBlockDto {
  @ApiProperty({
    example: ['Frontend', 'Backend'],
    description: 'Direction name',
  })
  @IsArray()
  @IsNotEmpty()
  directionName: string[];

  @ApiProperty({ example: 'JS', description: 'Block name' })
  @IsNotEmpty()
  @IsString()
  blockName: string;

  @ApiProperty({ example: 15, description: 'Number of questions in a block' })
  numberOfQuestions: number;

  @ApiProperty({ example: 15, description: 'Block completion time' })
  blockCompletionTime: number;

  @ApiProperty({
    example: 10,
    description: 'Number of correct answers in a block',
  })
  numberOfCorrectAnswers: number;
}

export class RequestQuestionBlockDto {
  @ApiProperty({ example: 1, description: 'Questions block id' })
  @IsNumber()
  id: number;

  @ApiProperty({
    example: '2023-06-17T11:48:47.135Z',
    description: 'Questions block createAt',
  })
  @IsString()
  createAt: string;

  @ApiProperty({
    example: '2023-06-17T11:48:47.135Z',
    description: 'Questions block updateAt',
  })
  @IsString()
  updateAt: string;

  @ApiProperty({
    example: ['Frontend', 'Backend'],
    description: 'Direction name',
  })
  @IsString()
  directionName: string[];

  @ApiProperty({ example: 'JS', description: 'Direction name' })
  @IsString()
  blockName: string;

  @ApiProperty({ example: 1, description: 'User`s id' })
  @IsNumber()
  ownerId: number;

  @ApiProperty({ example: 'admin', description: 'User`s role' })
  @IsString()
  owner: string;
}
