import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MulterConfigService } from './config/multer-config';

import { ParseXlsxController } from './parse-xlsx.controller';

import { ParseXlsxService } from './parse-xlsx.service';

import { JwtGuardsModule } from '@guards/jwtGuard/jwt-guard.module';
import { QuestionsModule } from '../questions/questions.module';

import { QuestionsBlockEntity } from '@entities/questions-block/questions-block.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuestionsBlockEntity]),
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    QuestionsModule,
    JwtGuardsModule,
  ],
  controllers: [ParseXlsxController],
  providers: [ParseXlsxService, ConfigService],
})
export class ParseXlsxModule {}
