import { ApiProperty } from '@nestjs/swagger';
import { MyBaseEntity } from '@src/base/base.entity';
import { Column, Entity } from 'typeorm';
import { EDifficulty } from '../../enums/difficulty.enum';

@Entity('questions')
export class QuestionEntity extends MyBaseEntity {
  @ApiProperty({ example: 'What is Node.js?', description: 'Text question' })
  @Column({ name: 'question_text', type: 'varchar' })
  public questionText: string;

  @ApiProperty({
    example: '<div class=”box”></div>',
    description: 'Code of question',
  })
  @Column({ name: 'code', type: 'varchar', nullable: true })
  public code: string;

  @ApiProperty({
    example: [1, 2, 3, 4],
    description: 'Question answers ids',
  })
  @Column({ name: 'answers_id', type: 'integer', array: true, nullable: true })
  public answersId: number[];

  @ApiProperty({ example: 1, description: 'Question block id' })
  @Column({ name: 'block_questions_id', type: 'integer' })
  public blockQuestionsId: number;

  @ApiProperty({ example: 'Easy', description: 'Question difficulty' })
  @Column({ name: 'difficulty', type: 'enum', enum: EDifficulty })
  public difficulty: string;

  @ApiProperty({ example: 3, description: 'Question points' })
  @Column({ name: 'points', type: 'integer' })
  public points: number;

  @ApiProperty({ example: 3, description: 'Admin id' })
  @Column({ name: 'owner', type: 'integer' })
  public owner: number;
}
