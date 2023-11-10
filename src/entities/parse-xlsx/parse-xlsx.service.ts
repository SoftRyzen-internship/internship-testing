import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';

@Injectable()
export class ParseXlsxService {
  public async uploadFileXlsx(file: Express.Multer.File, body: any) {
    const workbook = XLSX.readFile(file.path);
    // const sheet = 'JS';
    const sheet = workbook.Sheets['JS'];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    return jsonData;
  }
}
