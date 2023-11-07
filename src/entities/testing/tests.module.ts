import { AnswersEntity } from '@entities/answers/answers.entity';
import { InternshipStream } from '@entities/internship-stream/internship-stream.entity';
import { QuestionsBlockModule } from '@entities/questions-block/questions-block.module';
import { UserEntity } from '@entities/users/users.entity';
import { JwtGuardsModule } from '@guards/jwtGuard/jwt-guard.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestController } from './tests.controller';
import { Test } from './tests.entity';
import { TestsService } from './tests.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Test,
      UserEntity,
      InternshipStream,
      AnswersEntity,
    ]),
    JwtGuardsModule,
    QuestionsBlockModule,
  ],
  providers: [TestsService, ConfigService],
  controllers: [TestController],
})
export class TestsModule {}
