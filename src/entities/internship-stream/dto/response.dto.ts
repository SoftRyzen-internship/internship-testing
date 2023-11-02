import { ApiProperty } from '@nestjs/swagger';

export class ResponseStreamDto {
  @ApiProperty({
    example: 'Stream Winter 2023',
    description: 'Internship Stream',
  })
  internshipStreamName: string;

  @ApiProperty({
    example: ['Frontend', 'Backend', 'QA', 'PM', 'FullStack'],
    description: 'Internship Stream',
  })
  public directions: string[];

  @ApiProperty({
    example: 1,
    description: 'Internship number',
  })
  public number: number;

  @ApiProperty({
    example: 1,
    description: 'Admin id',
  })
  public ownerId: number;

  @ApiProperty({
    example: 'admin',
    description: 'Role owner',
  })
  public owner: string;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'Start date of internship stream',
  })
  public startDate: Date;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'End date of internship stream',
  })
  public endDate: Date;

  @ApiProperty({
    example: 1,
    description: 'Internship Stream Id',
  })
  public id: number;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'createAt',
  })
  public createAt: Date;

  @ApiProperty({
    example: '2023-11-01T00:00:00.000Z',
    description: 'updateAt',
  })
  public updateAt: Date;

  @ApiProperty({
    example: true,
    description: 'Is active stream',
  })
  public isActive: boolean;

  @ApiProperty({ example: 15, description: 'Total number of registered' })
  totalNumberRegistered: number;

  @ApiProperty({ example: 5, description: 'Did not complete the internship' })
  notCompleteInternship: number;

  @ApiProperty({ example: 10, description: 'Completed an internship' })
  completeInternship: number;
}
