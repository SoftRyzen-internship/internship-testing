import { MailModule } from '@entities/mail/mail.module';
import { MailService } from '@entities/mail/mail.service';
import { RedisModule } from '@entities/redis/redis.module';
import { User } from '@entities/users/users.entity';
import { JwtGuardsModule } from '@guards/jwtGuard/jwt-guard.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SetRedisService } from './set-redis.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/avatars',
    }),
    RedisModule,
    JwtGuardsModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, SetRedisService, MailService, ConfigService],
  exports: [AuthService],
})
export class AuthModule {}
