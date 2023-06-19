import { TypeOrmModule } from '@db/typeorm.config';
import { AuthModule } from '@entities/auth/auth.module';
import { MailModule } from '@entities/mail/mail.module';
import { QuestionsModule } from '@entities/questions/questions.module';
import { UserModule } from '@entities/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from './config.module';
import { RedisModule } from './entities/redis/redis.module';
import { GoogleModule } from './entities/google/google.module';
import { UploadModule } from './entities/upload/upload.module';
import { InternshipStreamModule } from '@entities/internship-stream/internship-stream.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule,
    AuthModule,
    UserModule,
    MailModule,
    QuestionsModule,
    RedisModule,
    GoogleModule,
    UploadModule,
    InternshipStreamModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
