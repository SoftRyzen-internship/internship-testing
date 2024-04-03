import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtGuardsModule } from '@guards/jwtGuard/jwt-guard.module';

import { QuestionsBlockController } from './questions-block.controller';

import { QuestionsBlockService } from './questions-block.service';

import { QuestionsBlockEntity } from '@entities/questions-block/questions-block.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionsBlockEntity]), JwtGuardsModule],
  controllers: [QuestionsBlockController],
  providers: [QuestionsBlockService, ConfigService],
  exports: [QuestionsBlockService],
})
export class QuestionsBlockModule {}
