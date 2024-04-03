import { AttemptsModule } from '@entities/attempts/attempts.module';
import { BlockIpMiddleware } from '@entities/attempts/middleware/attempts.middleware';
import { GoogleDriveModule } from '@entities/google-drive/google-drive.module';
import { InternshipStreamModule } from '@entities/internship-stream/internship-stream.module';
import { MailModule } from '@entities/mail/mail.module';
import { MailService } from '@entities/mail/mail.service';
import { TokensModule } from '@entities/tokens/tokens.module';
import { RoleEntity } from '@entities/users/role.entity';
import { UserEntity } from '@entities/users/users.entity';
import { JwtGuardsModule } from '@guards/jwtGuard/jwt-guard.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

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
    InternshipStreamModule,
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
