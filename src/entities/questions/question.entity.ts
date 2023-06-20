import { ApiProperty } from '@nestjs/swagger';
import { MyBaseEntity } from '@utils/base.entity';
import { Entity, Column } from 'typeorm';
import { Difficulty } from './enums/difficulty.enum';

@Entity()
export class Question extends MyBaseEntity{
  @ApiProperty({ example: 'What is Node.js?', description: 'Text question' })
    @Column({ name: 'questionText', type: 'varchar' })
  questionText: string;

  @ApiProperty({ example: '123', description: 'Code of question' })
  @Column({ name: 'code', type: 'varchar', nullable: true })
  code: string;

  @ApiProperty({ example: ['Answer 1', 'Answer 2'], description: 'Answers to the question' })
  @Column({ name: 'answers', type: 'varchar', array: true })
  answers: string[];

   @ApiProperty({ example: 2, description: 'Index of the correct answer' })
  @Column()
  correctAnswerIndex: number;

  @ApiProperty({ example: 'Direction', description: 'Question direction' })
  @Column()
  direction: string;

  @ApiProperty({ example: 'Block', description: 'Question block' })
  @Column()
  block: string;

  @ApiProperty({ example: 'EASY', description: 'Question difficulty' })
  @Column({ name: 'difficulty',type: 'enum', enum: Difficulty })
  difficulty: string;

  @ApiProperty({ example: 3, description: 'Question points' })
  @Column()
  points: number;
}
