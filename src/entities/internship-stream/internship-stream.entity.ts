import { ApiProperty } from '@nestjs/swagger';
import { MyBaseEntity } from '@src/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('stream')
export class InternshipStream extends MyBaseEntity {
  @ApiProperty({
    example: 'Stream Winter 2023',
    description: 'Internship Stream',
  })
  @Column({ name: 'internship_stream', type: 'varchar' })
  internshipStreamName: string;

  @ApiProperty({
    example: ['Frontend', 'Backend', 'QA', 'PM', 'FullStack'],
    description: 'Directions on the stream',
  })
  @Column({ name: 'directions', type: 'varchar', array: true })
  directions: string[];

  @ApiProperty({ example: 1, description: 'Stream number' })
  @Column({ name: 'number', type: 'integer' })
  number: number;

  @ApiProperty({ example: 'true', description: 'Status internship stream' })
  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @ApiProperty({ example: 1, description: 'Admin id' })
  @Column({ name: 'owner_id', type: 'integer', nullable: true })
  ownerId: number;

  @ApiProperty({ example: 'admin', description: 'Role user`s' })
  @Column({ name: 'owner_role', type: 'varchar', nullable: true })
  owner: string;

  @ApiProperty({
    example: 'Start date',
    description: 'Start date of internship stream',
  })
  @Column({
    name: 'start_date',
    type: 'timestamp',
    nullable: true,
  })
  startDate: Date;

  @ApiProperty({
    example: 'End date',
    description: 'End date of internship stream',
  })
  @Column({ name: 'end_date', type: 'timestamp', nullable: true })
  endDate: Date;

  @ApiProperty({ example: 825, description: 'Average test score' })
  @Column({ name: 'average_test_score', type: 'integer', default: 0 })
  averageTestScore: number;

  @ApiProperty({ example: 5, description: 'Did not complete the internship' })
  @Column({ name: 'not_complete_internship', type: 'integer', default: 0 })
  notCompleteInternship: number;

  @ApiProperty({ example: 10, description: 'Completed an internship' })
  @Column({ name: 'complete_internship', type: 'integer', default: 0 })
  completeInternship: number;
}
