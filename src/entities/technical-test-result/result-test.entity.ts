import { ApiProperty } from '@nestjs/swagger';
import { MyBaseEntity } from '@src/base/base.entity';
import { EDifficulty } from '@src/enums/difficulty.enum';
import { Column, Entity } from 'typeorm';

@Entity('result_tech_test')
export class ResultTechnicalTest extends MyBaseEntity {
  @ApiProperty({
    example: 1,
    description: 'User id',
  })
  @Column({ name: 'user_id', type: 'int' })
  public userId: number;

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
  @Column({ name: 'comments', type: 'text' })
  public comments: string;

  @ApiProperty({ example: false, description: 'Is check test' })
  @Column({ name: 'is_checked', type: 'boolean', default: false })
  public isChecked: boolean;
}
