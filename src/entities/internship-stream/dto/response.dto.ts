import { ApiProperty } from '@nestjs/swagger';

export class ResponseDirectionsOfStreamDto {
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
    example: 'Frontend',
    description: 'Internship direction',
    required: true,
  })
  direction: string;

  @ApiProperty({
    example:
      'Development of web interfaces, using modern frameworks and tools...',
    description: 'Direction description',
    required: true,
  })
  description: string;

  @ApiProperty({
    example: ['Next.js', 'Tailwind', 'React', 'JavaScript', 'TypeScript'],
    description: 'Direction technologies',
    required: true,
  })
  technologies: string[];

  @ApiProperty({ example: 1, description: 'Admin id' })
  ownerId: number;

  @ApiProperty({ example: 'admin', description: 'Role' })
  owner: string;
}
export class ResponseStreamDto {
  @ApiProperty({
    example: 'Stream Winter 2023',
    description: 'Internship Stream',
  })
  internshipStreamName: string;

  @ApiProperty({ example: [1, 2, 3, 4, 5], description: 'Directions id' })
  public directionsIds: number[];

 

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

  @ApiProperty({
    example: true,
    description: 'Is open register',
  })
  public isOpenRegister: boolean;

  @ApiProperty({ example: 800, description: 'Average test score' })
  averageTestScore: number;

  @ApiProperty({ example: 5, description: 'Did not complete the internship' })
  notCompleteInternship: number;

  @ApiProperty({ example: 10, description: 'Completed an internship' })
  completeInternship: number;
}

export class ResponseActiveStreamDto extends ResponseStreamDto {
  @ApiProperty({
    type: [ResponseDirectionsOfStreamDto],
  })
  public directions: ResponseDirectionsOfStreamDto[];
}
