import { AuthModule } from '@entities/auth/auth.module';
import { AuthService } from '@entities/auth/auth.service';
import { SetRedisService } from '@entities/auth/set-redis.service';
import { InternshipStream } from '@entities/internship-stream/internship-stream.entity';
import { MailService } from '@entities/mail/mail.service';
import { RedisCacheService } from '@entities/redis/redis.service';
import { Role } from '@entities/users/role.entity';
import { User } from '@entities/users/users.entity';
import { JwtGuardsModule } from '@guards/jwtGuard/jwt-guard.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleStrategy } from '@src/strategy/google.strategy';
import { join } from 'path';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, InternshipStream]),
    PassportModule,
    JwtGuardsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/avatars',
    }),
    AuthModule,
  ],
  controllers: [GoogleController],
  providers: [
    GoogleService,
    GoogleStrategy,
    AuthService,
    SetRedisService,
    RedisCacheService,
    MailService,
  ],
})
export class GoogleModule {}
