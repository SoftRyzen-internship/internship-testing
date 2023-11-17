import { AttemptsModule } from '@entities/attempts/attempts.module';
import { AuthService } from '@entities/auth/auth.service';
import { InternshipStreamModule } from '@entities/internship-stream/internship-stream.module';
import { MailService } from '@entities/mail/mail.service';
import { TokensModule } from '@entities/tokens/tokens.module';
import { RoleEntity } from '@entities/users/role.entity';
import { UserEntity } from '@entities/users/users.entity';
import { UserModule } from '@entities/users/users.module';
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
    InternshipStreamModule,
  ],
  controllers: [GoogleController],
  providers: [GoogleService, GoogleStrategy, AuthService, MailService],
})
export class GoogleModule {}
