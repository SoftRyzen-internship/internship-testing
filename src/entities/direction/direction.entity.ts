import { ApiProperty } from '@nestjs/swagger';
import { MyBaseEntity } from '@src/base/base.entity';
import * as regex from '@src/constants/regex-expressions';
import { Matches } from 'class-validator';
import { Column, Entity, Unique } from 'typeorm';

@Entity('direction')
export class DirectionEntity extends MyBaseEntity {
  @ApiProperty({ example: 'Frontend', description: 'Internship direction' })
  @Column({ name: 'internship_direction', type: 'varchar' })
  @Unique(['direction'])
  direction: string;

  @ApiProperty({
    example:
      'Development of web interfaces, using modern frameworks and tools...',
    description: 'Direction description',
    required: true,
  })
  @Column({ name: 'description', type: 'varchar', nullable: true })
  description: string;

  @ApiProperty({
    example: ['Next.js', 'Tailwind', 'React', 'JavaScript', 'TypeScript'],
    description: 'Direction technologies',
    required: true,
  })
  @Column({ name: 'technologies', type: 'text', array: true, nullable: true })
  technologies: string[];

  @ApiProperty({ example: 1, description: 'Admin id' })
  @Column({ name: 'owner_id', type: 'integer' })
  ownerId: number;

  @ApiProperty({ example: 'admin', description: 'Role user`s' })
  @Column({ name: 'owner_role', type: 'varchar' })
  owner: string;

  @ApiProperty({
    example: 'https://www.description.com/direction',
    description: 'Description of the direction',
    required: true,
  })
  @Column({
    name: 'description_direction_url',
    type: 'varchar',
    nullable: true,
  })
  @Matches(regex.linkRegex, {
    message: 'This should have been a link',
  })
  public descriptionDirectionUrl: string;
}
