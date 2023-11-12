import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ParseXlsxBodyFileDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File to upload',
  })
  @IsNotEmpty()
  file: Express.Multer.File;
}

export class ParseXlsxDto {
  @ApiProperty({
    example: 'HTMLCSS',
    description: 'Title of the page in the file .xlsx',
  })
  @IsNotEmpty()
  public sheetName: string;
}

export class ResponseParseXlsxDto {
  @ApiProperty({
    example: 'Access',
    description: 'File uploaded',
  })
  @IsNotEmpty()
  public message: string;
}
