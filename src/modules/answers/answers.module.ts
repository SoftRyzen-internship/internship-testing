import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnswersEntity } from '@entities/answers/answers.entity';
import { QuestionEntity } from '@entities/questions/questions.entity';
import { JwtGuardsModule } from '@guards/jwtGuard/jwt-guard.module';

import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnswersEntity, QuestionEntity]),
    JwtGuardsModule,
  ],
  controllers: [AnswersController],
  providers: [AnswersService, ConfigService],
  exports: [AnswersService],
})
export class AnswersModule {}
