import { ApiProperty } from '@nestjs/swagger';
import { EDirections } from '@src/enums/direction.enum';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateDirectionDto {
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
}
