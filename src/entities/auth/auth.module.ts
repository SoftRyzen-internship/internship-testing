import { User } from '@entities/users/users.entity';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginAttemptsService } from './login-attempts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/avatars',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LoginAttemptsService],
  exports: [AuthService],
})
export class AuthModule {}
