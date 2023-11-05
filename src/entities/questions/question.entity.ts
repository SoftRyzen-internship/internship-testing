import { ApiProperty } from '@nestjs/swagger';
import { MyBaseEntity } from '@src/base/base.entity';
import { Column, Entity } from 'typeorm';
import { EDifficulty } from './enums/difficulty.enum';

@Entity('questions')
export class Question extends MyBaseEntity {
  @ApiProperty({ example: 'What is Node.js?', description: 'Text question' })
  @Column({ name: 'questionText', type: 'varchar' })
  questionText: string;

  @ApiProperty({ example: '123', description: 'Code of question' })
  @Column({ name: 'code', type: 'varchar', nullable: true })
  code: string;

  @ApiProperty({
    example: [
      { answer: 'Answer 1', right: true },
      { answer: 'Answer 2', right: false },
    ],
    description: 'Answers to the question',
  })
  @Column({ name: 'answers', type: 'jsonb' })
  answers: string;

  @ApiProperty({ example: 1, description: 'Question block id' })
  @Column({ name: 'block_questions', type: 'integer' })
  blockQuestionsId: number;

  @ApiProperty({ example: 'Easy', description: 'Question difficulty' })
  @Column({ name: 'difficulty', type: 'enum', enum: EDifficulty })
  difficulty: string;

  @ApiProperty({ example: 3, description: 'Question points' })
  @Column({ name: 'points', type: 'integer' })
  points: number;

  @ApiProperty({ example: 3, description: 'Admin id' })
  @Column({ name: 'owner', type: 'integer' })
  owner: number;
}
