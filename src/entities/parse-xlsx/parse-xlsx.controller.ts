import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ParseXlsxService } from './parse-xlsx.service';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Parse xlsx file')
@Controller('api/parse-xlsx')
export class ParseXlsxController {
  constructor(private readonly parseXlsxService: ParseXlsxService) {}

  // Upload file
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFileXlsx(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    return await this.parseXlsxService.uploadFileXlsx(file, body);
  }
}
