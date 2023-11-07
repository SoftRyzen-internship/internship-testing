import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class AddDirectionDto {
  @ApiProperty({
    example: 'Frontend',
    description: 'Internship direction',
    required: true,
  })
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  direction: string;

  @ApiProperty({
    example:
      'Development of web interfaces, using modern frameworks and tools...',
    description: 'Direction description',
    required: true,
  })
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: ['Next.js', 'Tailwind', 'React', 'JavaScript', 'TypeScript'],
    description: 'Direction technologies',
    required: true,
  })
  @ArrayNotEmpty()
  @ArrayUnique()
  technologies: string[];
}

export class ResponseDirectionDto extends AddDirectionDto {
  @ApiProperty({ example: 1, description: 'Admin id' })
  ownerId: number;

  @ApiProperty({ example: 'admin', description: 'Role' })
  owner: string;

  @ApiProperty({ example: 1, description: 'Unique id test`s' })
  id: number;

  @ApiProperty({
    example: '2023-06-13T14:58:05.590Z',
    description: 'Create At',
  })
  public createAt: string;

  @ApiProperty({
    example: '2023-06-13T14:58:05.590Z',
    description: 'Update At',
  })
  public updateAt: string;
}
