import { ApiProperty } from '@nestjs/swagger';
import { MyBaseEntity } from '@src/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('answers')
export class AnswersEntity extends MyBaseEntity {
  @ApiProperty({
    example: 'Cascading Style Sheets',
    description: 'Question answer',
  })
  @Column({ name: 'answer', type: 'varchar' })
  public answer: string;

  @ApiProperty({
    example: 'JS',
    description: 'Block questions name',
  })
  @Column({ name: 'block_name', type: 'varchar', nullable: true })
  public blockName: string;

  @ApiProperty({
    example: true,
    description: 'Is the answer correct?',
  })
  @Column({
    name: 'is_right',
    type: 'boolean',
    default: false,
  })
  public isRight: boolean;

  @ApiProperty({ example: 1, description: 'Question id' })
  @Column({ name: 'owner', type: 'integer' })
  public owner: number;
}
