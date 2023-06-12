import { RedisModule } from '@entities/redis/redis.module';
import { User } from '@entities/users/users.entity';
import { JwtGuardsModule } from '@guards/jwtGuard/jwt-guard.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginAttemptsService } from './login-attempts.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RedisModule, JwtGuardsModule],
  controllers: [AuthController],
  providers: [AuthService, LoginAttemptsService],
  exports: [AuthService],
})
export class AuthModule {}
