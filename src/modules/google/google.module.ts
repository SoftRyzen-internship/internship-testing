import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { JwtGuardsModule } from '@guards/jwtGuard/jwt-guard.module';
import { AttemptsModule } from '../attempts/attempts.module';
import { StreamModule } from '../stream/stream.module';
import { TokensModule } from '../tokens/tokens.module';
import { UserModule } from '../users/users.module';

import { GoogleStrategy } from '@src/strategy/google.strategy';

import { GoogleController } from './google.controller';

import { RoleEntity } from '@entities/roles/role.entity';
import { UserEntity } from '@entities/users/users.entity';

import { AuthService } from '../auth/auth.service';
import { MailService } from '../mail/mail.service';
import { GoogleService } from './google.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RoleEntity]),
    PassportModule,
    JwtGuardsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/avatars',
    }),
    UserModule,
    AttemptsModule,
    TokensModule,
    StreamModule,
  ],
  controllers: [GoogleController],
  providers: [GoogleService, GoogleStrategy, AuthService, MailService],
})
export class GoogleModule {}
