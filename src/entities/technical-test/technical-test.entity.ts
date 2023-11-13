import { ApiProperty } from '@nestjs/swagger';
import { MyBaseEntity } from '@src/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('tech_test')
export class TechnicalTestEntity extends MyBaseEntity {
  @ApiProperty({ example: 1, description: 'Internship stream id' })
  @Column({ name: 'internship_stream_id', type: 'integer' })
  public internshipStreamId: number;

  @ApiProperty({ example: 'Frontend', description: 'Direction' })
  @Column({ name: 'direction', type: 'varchar' })
  public direction: string;

  @ApiProperty({
    example: 'Test task for <Direction>',
    description: 'Test task for <Direction>',
  })
  @Column({ name: 'title', type: 'varchar' })
  public title: string;

  @ApiProperty({
    example: 'Implement functionality for a web application using React',
    description: 'Short description of test',
  })
  @Column({ name: 'short_description', type: 'varchar' })
  public shortDescription: string;

  @ApiProperty({
    example: 'https://document.com',
    description: 'Materials for test',
  })
  @Column({ name: 'tech_documentation_url', type: 'varchar' })
  public techDocumentationUrl: string;

  @ApiProperty({
    example: 'https://www.figma.com',
    description: 'Layout for test',
  })
  @Column({ name: 'tech_layout_url', type: 'varchar', nullable: true })
  public techLayoutUrl: string;

  @ApiProperty({
    example: [
      'Layout fixed in px',
      'The layout is semantic and valid, accessibility will be a bonus (a11y)',
    ],
    description: 'Acceptance Criteria',
  })
  @Column({ name: 'acceptance_criteria', type: 'varchar', array: true })
  public acceptanceCriteria: string[];

  @ApiProperty({
    example: '25.07.2023 12:00',
    description: 'Deadline',
  })
  @Column({
    name: 'deadline',
    type: 'timestamp',
  })
  public deadline: Date;
}
