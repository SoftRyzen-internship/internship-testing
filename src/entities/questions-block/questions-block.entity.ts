import { MyBaseEntity } from '@entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'block_questions' })
export class QuestionsBlockEntity extends MyBaseEntity {
  @ApiProperty({
    example: ['Frontend', 'Backend'],
    description: 'Direction name',
  })
  @Column({ name: 'direction_name', type: 'varchar', array: true })
  directionName: string[];

  @ApiProperty({ example: 'JS', description: 'Block name' })
  @Column({ name: 'block_name', type: 'varchar' })
  blockName: string;

  @ApiProperty({ example: '1', description: 'Admin`s id' })
  @Column({ name: 'owner_id', type: 'integer' })
  ownerId: number;

  @ApiProperty({ example: 15, description: 'Number of questions in a block' })
  @Column({ name: 'number_of_questions', type: 'integer' })
  numberOfQuestions: number;

  @ApiProperty({ example: 15, description: 'Block completion time' })
  @Column({ name: 'block_completion_time', type: 'integer' })
  blockCompletionTime: number;

  @ApiProperty({
    example: 10,
    description: 'Number of correct answers in a block',
  })
  @Column({ name: 'number_of_correct_answers', type: 'integer' })
  numberOfCorrectAnswers: number;

  @ApiProperty({ example: 'admin', description: 'User role' })
  @Column({ name: 'owner_role', type: 'varchar' })
  owner: string;
}
