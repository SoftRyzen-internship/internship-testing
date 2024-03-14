import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TestController } from './tests.controller';

import { TestsService } from './tests.service';

import { AnswersEntity } from '@entities/answers/answers.entity';
import { StreamEntity } from '@entities/streams/streams.entity';
import { TestEntity } from '@entities/testing/testing.entity';
import { UserEntity } from '@entities/users/users.entity';

import { JwtGuardsModule } from '@guards/jwtGuard/jwt-guard.module';
import { AnswersModule } from '../answers/answers.module';
import { GoogleDriveModule } from '../google-drive/google-drive.module';
import { QuestionsBlockModule } from '../questions-block/questions-block.module';
import { QuestionsModule } from '../questions/questions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TestEntity,
      UserEntity,
      StreamEntity,
      AnswersEntity,
    ]),
    JwtGuardsModule,
    QuestionsBlockModule,
    AnswersModule,
    QuestionsModule,
    GoogleDriveModule,
  ],
  providers: [TestsService, ConfigService],
  controllers: [TestController],
})
export class TestsModule {}
