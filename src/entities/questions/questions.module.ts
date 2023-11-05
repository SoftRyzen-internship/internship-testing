import { QuestionsBlockEntity } from '@entities/questions-block/questions-block.entity';
import { JwtGuardsModule } from '@guards/jwtGuard/jwt-guard.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './question.entity';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, QuestionsBlockEntity]),
    JwtGuardsModule,
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService, ConfigService],
})
export class QuestionsModule {}
