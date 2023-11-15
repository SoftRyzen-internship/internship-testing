import { QuestionEntity } from '@entities/questions/question.entity';
import { JwtGuardsModule } from '@guards/jwtGuard/jwt-guard.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswersController } from './answers.controller';
import { AnswersEntity } from './answers.entity';
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
