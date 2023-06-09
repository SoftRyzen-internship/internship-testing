import { TypeOrmModule } from '@db/typeorm.config';
import { AuthModule } from '@entities/auth/auth.module';
import { MailModule } from '@entities/mail/mail.module';
import { QuestionsModule } from '@entities/questions/questions.module';
import { UserModule } from '@entities/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from './config.module';
import { RedisCacheModule } from './entities/redis/redis.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule,
    AuthModule,
    UserModule,
    MailModule,
    QuestionsModule,
    RedisCacheModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
