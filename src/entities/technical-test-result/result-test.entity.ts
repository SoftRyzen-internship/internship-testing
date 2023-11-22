import { ApiProperty } from '@nestjs/swagger';
import { MyBaseEntity } from '@src/base/base.entity';
import { EDifficulty } from '@src/enums/difficulty.enum';
import { Column, Entity } from 'typeorm';

@Entity('result_tech_test')
export class ResultTechnicalTestEntity extends MyBaseEntity {
  @ApiProperty({
    example: 1,
    description: 'User id',
  })
  @Column({ name: 'user_id', type: 'integer' })
  public userId: number;

  @ApiProperty({
    example: 1,
    description: 'User id',
  })
  @Column({ name: 'stream_id', type: 'integer', nullable: true })
  public streamId: number;

  @ApiProperty({
    example: 'https://livepage.com',
    description: 'Link to live page',
  })
  @Column({ name: 'live_page_link', type: 'varchar' })
  public livePageLink: string;

  @ApiProperty({
    example: 'https://repository.com',
    description: 'Link to repository',
  })
  @Column({ name: 'repository_link', type: 'varchar' })
  public repositoryLink: string;

  @ApiProperty({ enum: EDifficulty, default: EDifficulty.EASY })
  @Column({
    name: 'difficulty',
    type: 'enum',
    enum: EDifficulty,
    default: EDifficulty.EASY,
  })
  public difficulty: EDifficulty;

  @ApiProperty({ example: 'Some comments', description: 'Comments' })
  @Column({ name: 'comments', type: 'varchar', nullable: true })
  public comments: string;

  @ApiProperty({ example: false, description: 'Is check test' })
  @Column({ name: 'is_checked', type: 'boolean', default: false })
  public isChecked: boolean;

  @ApiProperty({ example: false, description: 'Is passed technical task' })
  @Column({ name: 'is_passed_technical_task', type: 'boolean', default: false })
  public isPassedTechnicalTask: boolean;
}
