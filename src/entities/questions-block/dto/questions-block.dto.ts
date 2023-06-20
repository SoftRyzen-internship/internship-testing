import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class QuestionBlockDto {
  @ApiProperty({ example: 'Full stack', description: 'Direction name' })
  @IsNotEmpty()
  @IsString()
  directionName: string;

  @ApiProperty({ example: 'Question 1', description: 'Block name' })
  @IsNotEmpty()
  @IsString()
  blockName: string;
}
