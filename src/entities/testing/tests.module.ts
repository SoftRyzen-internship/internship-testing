import { AnswersEntity } from '@entities/answers/answers.entity';
import { AnswersModule } from '@entities/answers/answers.module';
import { InternshipStreamEntity } from '@entities/internship-stream/internship-stream.entity';
import { QuestionsBlockModule } from '@entities/questions-block/questions-block.module';
import { QuestionsModule } from '@entities/questions/questions.module';
import { UserEntity } from '@entities/users/users.entity';
import { JwtGuardsModule } from '@guards/jwtGuard/jwt-guard.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestController } from './tests.controller';
import { TestEntity } from './tests.entity';
import { TestsService } from './tests.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TestEntity,
      UserEntity,
      InternshipStreamEntity,
      AnswersEntity,
    ]),
    JwtGuardsModule,
    QuestionsBlockModule,
    AnswersModule,
    QuestionsModule,
  ],
  providers: [TestsService, ConfigService],
  controllers: [TestController],
})
export class TestsModule {}
