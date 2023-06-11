import { RedisCacheModule } from '@db/redis.config';
import { Module } from '@nestjs/common';
import { RedisCacheService } from './redis.service';

@Module({
  imports: [RedisCacheModule],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisModule {}
