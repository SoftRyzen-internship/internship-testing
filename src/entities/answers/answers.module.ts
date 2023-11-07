import { QuestionsBlockEntity } from '@entities/questions-block/questions-block.entity';
import { Question } from '@entities/questions/question.entity';
import { JwtGuardsModule } from '@guards/jwtGuard/jwt-guard.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswersController } from './answers.controller';
import { AnswersEntity } from './answers.entity';
import { AnswersService } from './answers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnswersEntity, Question, QuestionsBlockEntity]),
    JwtGuardsModule,
  ],
  controllers: [AnswersController],
  providers: [AnswersService, ConfigService],
})
export class AnswersModule {}
