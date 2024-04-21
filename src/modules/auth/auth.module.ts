import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { RoleEntity } from '@entities/roles/role.entity';
import { UserEntity } from '@entities/users/users.entity';

import { JwtGuardsModule } from '@guards/jwtGuard/jwt-guard.module';
import { AttemptsModule } from '../attempts/attempts.module';
import { GoogleDriveModule } from '../google-drive/google-drive.module';
import { MailModule } from '../mail/mail.module';
import { StreamModule } from '../stream/stream.module';
import { TokensModule } from '../tokens/tokens.module';

import { MailService } from '../mail/mail.service';
import { AuthService } from './auth.service';

import { AuthController } from './auth.controller';

import { BlockIpMiddleware } from '../attempts/middleware/attempts.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RoleEntity]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/avatars',
    }),
    JwtGuardsModule,
    MailModule,
    AttemptsModule,
    TokensModule,
    StreamModule,
    GoogleDriveModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, MailService, ConfigService],
  exports: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BlockIpMiddleware).forRoutes('api/auth/login');
  }
}
