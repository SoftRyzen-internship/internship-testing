import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateDirectionDto {
  @ApiProperty({
    example: 'Frontend',
    description: 'Direction in which the user was trained',
  })
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  public direction: string;
}
