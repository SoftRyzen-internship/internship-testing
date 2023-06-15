import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddDirection {
  @ApiProperty({
    example: 'Full stack',
    description: 'Internship direction',
  })
  @IsString()
  direction: string;
}
