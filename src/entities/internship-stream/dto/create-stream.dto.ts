import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateStreamDto {
  @ApiProperty({
    example: 'Stream Winter 2023',
    description: 'Internship Stream',
  })
  @IsString()
  @IsNotEmpty()
  internshipStreamName: string;

  @ApiProperty({
    example: ['Frontend', 'Backend', 'QA', 'PM', 'FullStack'],
    description: 'Directions on the stream',
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  directions: string[];

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'Start date of internship stream',
  })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'End date of internship stream',
  })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  endDate: Date;
}
