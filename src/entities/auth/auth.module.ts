import { RedisCacheModule } from '@entities/redis/redis.module';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [RedisCacheModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
