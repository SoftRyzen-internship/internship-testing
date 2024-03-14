import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { TypeOrmModule } from '@db/typeorm.config';

import { GlobalExceptionFilter } from './logger/global-exception-filter';

import { GlobalLoggerService } from './logger/global-logger.service';

import { CorsMiddleware } from './middlewares/cors-middleware';

import { ConfigModule } from './config.module';
import { AnswersModule } from './modules/answers/answers.module';
import { AttemptsModule } from './modules/attempts/attempts.module';
import { AuthModule } from './modules/auth/auth.module';
import { BaseModule } from './modules/base/base.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { DirectionModule } from './modules/direction/direction.module';
import { GoogleDriveModule } from './modules/google-drive/google-drive.module';
import { GoogleModule } from './modules/google/google.module';
import { MailModule } from './modules/mail/mail.module';
import { MaterialsModule } from './modules/materials/materials.module';
import { ParseXlsxModule } from './modules/parse-xlsx/parse-xlsx.module';
import { PasswordModule } from './modules/passwords/passwords.module';
import { QuestionsBlockModule } from './modules/questions-block/questions-block.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { StreamModule } from './modules/stream/stream.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { TechnicalTestResultModule } from './modules/technical-test-result/technical-test-result.module';
import { TechnicalTestModule } from './modules/technical-test/technical-test.module';
import { TestsModule } from './modules/testing/tests.module';
import { TokensModule } from './modules/tokens/tokens.module';
import { UploadModule } from './modules/upload/upload.module';
import { UserModule } from './modules/users/users.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '../public'),
      serveRoot: '/public',
    }),
    ConfigModule,
    TypeOrmModule,
    AuthModule,
    UserModule,
    MailModule,
    QuestionsModule,
    GoogleModule,
    UploadModule,
    StreamModule,
    MaterialsModule,
    QuestionsBlockModule,
    DirectionModule,
    TestsModule,
    AttemptsModule,
    TechnicalTestModule,
    TokensModule,
    PasswordModule,
    AnswersModule,
    TechnicalTestResultModule,
    ParseXlsxModule,
    DashboardModule,
    TasksModule,
    BaseModule,
    GoogleDriveModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    GlobalLoggerService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes('*');
  }
}
