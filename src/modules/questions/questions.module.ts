import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuestionsController } from './questions.controller';

import { QuestionsService } from './questions.service';

import { AnswersEntity } from '@entities/answers/answers.entity';
import { QuestionsBlockEntity } from '@entities/questions-block/questions-block.entity';
import { QuestionEntity } from '@entities/questions/questions.entity';

import { JwtGuardsModule } from '@guards/jwtGuard/jwt-guard.module';
import { AnswersModule } from '../answers/answers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuestionEntity,
      QuestionsBlockEntity,
      AnswersEntity,
    ]),
    JwtGuardsModule,
    AnswersModule,
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService, ConfigService],
  exports: [QuestionsService],
})
export class QuestionsModule {}
