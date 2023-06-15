import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddDirectionDto {
  @ApiProperty({
    example: 'Full stack',
    description: 'Internship direction',
  })
  @IsString()
  direction: string;
}
