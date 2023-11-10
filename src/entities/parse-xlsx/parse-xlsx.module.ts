import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './config/multer-config';
import { ParseXlsxController } from './parse-xlsx.controller';
import { ParseXlsxService } from './parse-xlsx.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  controllers: [ParseXlsxController],
  providers: [ParseXlsxService],
})
export class ParseXlsxModule {}
