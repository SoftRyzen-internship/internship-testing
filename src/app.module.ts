import { TypeOrmModule } from '@db/typeorm.config';
import { Module } from '@nestjs/common';
import { ConfigModule } from './config.module';
import { AuthModule } from '@entities/auth/auth.module';
import { UserModule } from '@entities/users/users.module';
import { MailModule } from '@entities/mail/mail.module';
import { QuestionsModule } from '@entities/questions/questions.module';
import { PhoneModule } from './entities/phone/phone.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule,
    AuthModule,
    UserModule,
    MailModule,
    QuestionsModule,
    PhoneModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
