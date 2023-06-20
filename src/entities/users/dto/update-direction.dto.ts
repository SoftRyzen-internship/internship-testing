import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateDirectionDto {
  @ApiProperty({
    example: 'Full Stack',
    description: 'Direction in which the user was trained',
  })
  @IsString()
  direction: string;
}
