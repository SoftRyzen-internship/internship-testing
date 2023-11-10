import { Module } from '@nestjs/common';
import { ParseXlsxController } from './parse-xlsx.controller';
import { ParseXlsxService } from './parse-xlsx.service';

@Module({
  controllers: [ParseXlsxController],
  providers: [ParseXlsxService]
})
export class ParseXlsxModule {}
