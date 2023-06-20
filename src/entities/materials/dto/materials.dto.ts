import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AddMaterialsDto {
  @ApiProperty({ example: 'NextJS', description: 'Name material' })
  @IsString()
  materialName: string;

  @ApiProperty({ example: 1, description: 'Direction id' })
  @IsNumber()
  directionId: number;

  @ApiProperty({ example: 1, description: 'Question block id' })
  @IsNumber()
  questionBlockId: number;

  @ApiProperty({
    example: ['https://nextjs.org, ...'],
    description: 'Url material',
  })
  @IsString({ each: true })
  materialsUrl: string[];
}

export class ResponseMaterialsDto extends AddMaterialsDto {
  @ApiProperty({ example: '2023-06-19T11:56:30.734Z', description: 'CreateAt' })
  @IsString()
  createAt: string;

  @ApiProperty({
    example: '2023-06-19T11:56:30.734Z',
    description: 'UpdateAt',
  })
  updateAt: string;

  @ApiProperty({ example: 1, description: 'Material id' })
  @IsNumber()
  id: number;
}
