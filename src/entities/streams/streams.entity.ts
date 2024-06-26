import { MyBaseEntity } from '@entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

@Entity('stream')
export class StreamEntity extends MyBaseEntity {
  @ApiProperty({
    example: 'Stream Winter 2023',
    description: 'Internship Stream',
  })
  @Column({ name: 'internship_stream', type: 'varchar' })
  public internshipStreamName: string;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'Directions id on the stream',
  })
  @Column({ name: 'directions_ids', type: 'integer', array: true })
  public directionsIds: number[];

  @ApiProperty({ example: 1, description: 'Stream number' })
  @Column({ name: 'number', type: 'integer' })
  public number: number;

  @ApiProperty({ example: 'true', description: 'Status internship stream' })
  @Column({ name: 'is_active', type: 'boolean', default: true })
  public isActive: boolean;

  @ApiProperty({ example: 'true', description: 'Is open register' })
  @Column({ name: 'is_open_register', type: 'boolean', default: true })
  public isOpenRegister: boolean;

  @ApiProperty({ example: 1, description: 'Admin id' })
  @Column({ name: 'owner_id', type: 'integer', nullable: true })
  public ownerId: number;

  @ApiProperty({ example: 'admin', description: 'Role user`s' })
  @Column({ name: 'owner_role', type: 'varchar', nullable: true })
  public owner: string;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'Start date of internship stream',
  })
  @Column({
    name: 'start_date',
    type: 'timestamp',
    nullable: true,
  })
  public startDate: Date;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'End date of internship stream',
  })
  @Column({ name: 'end_date', type: 'timestamp', nullable: true })
  public endDate: Date;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'Start date of testing',
  })
  @Column({
    name: 'start_date_testing',
    type: 'timestamp',
    nullable: true,
  })
  public startDateTesting: Date;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'End date of testing',
  })
  @Column({ name: 'end_date_testing', type: 'timestamp', nullable: true })
  public endDateTesting: Date;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'Start date of technical test',
  })
  @Column({
    name: 'start_date_technical_test',
    type: 'timestamp',
    nullable: true,
  })
  public startDateTechnicalTest: Date;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'End date of internship stream',
  })
  @Column({
    name: 'end_date_technical_test',
    type: 'timestamp',
    nullable: true,
  })
  public endDateTechnicalTest: Date;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'Start date of online interview',
  })
  @Column({
    name: 'start_date_online_interview',
    type: 'timestamp',
    nullable: true,
  })
  public startDateOnlineInterview: Date;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'End date of online interview',
  })
  @Column({
    name: 'end_date_online_interview',
    type: 'timestamp',
    nullable: true,
  })
  public endDateOnlineInterview: Date;

  @ApiProperty({
    example: '1Y-WfnsMV_RU6BFjEV5zu-OYk0vOVPtuW',
    description: 'Spreadsheet id',
  })
  @Column({
    name: 'spreadsheet_id',
    type: 'varchar',
    nullable: true,
  })
  public spreadsheetId: string;

  @ApiProperty({ example: 825, description: 'Average test score' })
  @Column({ name: 'average_test_score', type: 'integer', default: 0 })
  public averageTestScore: number;

  @ApiProperty({ example: 5, description: 'Did not complete the internship' })
  @Column({ name: 'not_complete_internship', type: 'integer', default: 0 })
  public notCompleteInternship: number;

  @ApiProperty({ example: 10, description: 'Completed an internship' })
  @Column({ name: 'complete_internship', type: 'integer', default: 0 })
  public completeInternship: number;
}
