import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ParseXlsxDto {
  @ApiProperty({
    example: 'HTMLCSS',
    description: 'Title of the page in the file .xlsx',
  })
  @IsNotEmpty()
  public sheetName: string;
}
