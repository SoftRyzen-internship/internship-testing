
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '@entities/users/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", 'public'),
      serveRoot: '/avatars'
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, ],
  exports: [AuthService],
})
export class AuthModule {}
