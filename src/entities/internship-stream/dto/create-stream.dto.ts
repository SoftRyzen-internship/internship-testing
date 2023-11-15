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
  public internshipStreamName: string;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'Directions id on the stream',
  })
  @IsArray()
  @IsNotEmpty()
  public directionsIds: number[];

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'Start date of internship stream',
  })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  public startDate: Date;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'End date of internship stream',
  })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  public endDate: Date;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'Start date of testing',
  })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  public startDateTesting: Date;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'End date of testing',
  })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  public endDateTesting: Date;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'Start date of technical test',
  })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  public startDateTechnicalTest: Date;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'End date of internship stream',
  })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  public endDateTechnicalTest: Date;
}
