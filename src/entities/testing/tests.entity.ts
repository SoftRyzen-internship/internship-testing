import { ApiProperty } from '@nestjs/swagger';
import { MyBaseEntity } from '@src/base/base.entity';
import { EDifficulty } from '@src/enums/difficulty.enum';
import { Column, Entity } from 'typeorm';

@Entity('tests')
export class TestEntity extends MyBaseEntity {
  @ApiProperty({
    example: 'Stream Winter 2023',
    description: 'Internship Stream',
  })
  @Column({ name: 'internship_stream', type: 'varchar' })
  public internshipStream: string;

  @ApiProperty({ example: 1, description: 'Stream id' })
  @Column({ name: 'stream_id', type: 'integer', nullable: true })
  public streamId: number;

  @ApiProperty({
    example: 'Frontend',
    description: 'Direction in which the user was trained',
  })
  @Column({ name: 'direction', type: 'varchar', nullable: true })
  public direction: string;

  @ApiProperty({ example: 1, description: 'Stream number' })
  @Column({ name: 'stream_number', type: 'integer' })
  public streamNumber: number;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'Availability start date',
  })
  @Column({ name: 'start_date', type: 'timestamp' })
  public startDate: Date;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'Availability end date',
  })
  @Column({ name: 'end_date', type: 'timestamp' })
  public endDate: Date;

  @ApiProperty({ example: '60', description: 'Test time' })
  @Column({ name: 'test_time', type: 'varchar' })
  public testTime: string;

  @ApiProperty({
    example: { easy: 5, medium: 10, hard: 5 },
    description: 'Number of questions per difficulty level',
  })
  @Column({
    name: 'question_difficulty',
    type: 'enum',
    enum: EDifficulty,
    nullable: true,
  })
  public questionDifficulty: EDifficulty;

  @ApiProperty({
    example: [
      { blockQuestion: 'HTML/CSS', totalQuestions: 15, correctQuestions: 10 },
    ],
    description: 'Blocks of questions in the direction',
  })
  @Column({
    name: 'question_blocks',
    type: 'jsonb',
  })
  public questionBlocks: string;

  @ApiProperty({
    example: [
      { blockQuestion: 'HTML/CSS', totalQuestions: 15, correctQuestions: 10 },
    ],
    description: 'Test results',
  })
  @Column({
    name: 'test_results',
    type: 'jsonb',
    nullable: true,
  })
  public testResults: string;

  @ApiProperty({ example: 100, description: 'Number of questions in the test' })
  @Column({ name: 'number_of_questions', type: 'integer' })
  public numberOfQuestions: number;

  @ApiProperty({ example: 85, description: 'Passing score' })
  @Column({ name: 'passing_score', type: 'integer', default: 0 })
  public passingScore: number;

  @ApiProperty({ example: 85, description: 'Result of correct answers' })
  @Column({ name: 'correct_answers', type: 'integer', default: 0 })
  public correctAnswers: number;

  @ApiProperty({ example: 85, description: 'Minimum correct answers' })
  @Column({
    name: 'minimum_correct_answers',
    type: 'integer',
    default: 0,
    nullable: true,
  })
  public minimumCorrectAnswers: number;

  @ApiProperty({ example: true, description: 'Did you pass the test?' })
  @Column({ name: 'is_pass_test', type: 'boolean', default: false })
  public isPassTest: boolean;

  @ApiProperty({ example: 1, description: 'User id' })
  @Column({ name: 'owner', type: 'integer' })
  public userId: number;
}
