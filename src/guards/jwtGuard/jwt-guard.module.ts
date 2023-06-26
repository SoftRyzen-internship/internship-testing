import { RedisModule } from '@entities/redis/redis.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtRefreshGuard } from './jwt-refresh.guard';

@Module({
  imports: [JwtModule, ConfigModule, RedisModule],
  providers: [JwtAuthGuard, JwtRefreshGuard, ConfigService],
  exports: [JwtAuthGuard, JwtModule, JwtRefreshGuard],
})
export class JwtGuardsModule {}
