import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { AddDirection } from './add-direction.dto';

export class UpdateDirection extends AddDirection {
  @ApiProperty({ example: true, description: 'Will it be on stream' })
  @IsBoolean()
  isActive: boolean;
}
