import { ApiProperty } from '@nestjs/swagger';
import * as regex from '@src/constants/regex-expressions';
import { EDirections } from '@src/enums/direction.enum';
import { Transform } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

export class AddDirectionDto {
  @ApiProperty({
    example: 'Frontend',
    description: 'Direction in which the user was trained',
  })
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsEnum(EDirections, {
    message:
      'Direction must be a valid value: Frontend or Backend or UX/UI design or QA (Quality Assurance) or PM',
  })
  public direction: EDirections;

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

  @ApiProperty({
    example: 'https://www.description.com/direction',
    description: 'Description of the direction',
    required: true,
  })
  @Matches(regex.linkRegex, {
    message: 'This should have been a link',
  })
  public descriptionDirectionUrl: string;
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
