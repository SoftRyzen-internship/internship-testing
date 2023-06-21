import { User } from '@entities/users/users.entity';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleStrategy } from '@src/strategy/google.strategy';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { JwtGuardsModule } from '@guards/jwtGuard/jwt-guard.module';
import { AuthService } from '@entities/auth/auth.service';
import { Role } from '@entities/users/role.entity';
import { SetRedisService } from '@entities/auth/set-redis.service';
import { RedisCacheService } from '@entities/redis/redis.service';
import { MailService } from '@entities/mail/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), PassportModule, JwtGuardsModule,
  ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/avatars',
    })],
  controllers: [GoogleController],
  providers: [GoogleService, GoogleStrategy, AuthService, SetRedisService, RedisCacheService, MailService],
})
export class GoogleModule {}
