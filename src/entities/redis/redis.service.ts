import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

export type TRedisValue = string | number | Buffer;
@Injectable()
export class RedisCacheService {
  private readonly redisClient: Redis;
  constructor(private readonly redisService: RedisService) {
    this.redisClient = this.redisService.getClient();
  }

  public async get(key: string) {
    return this.redisClient.get(key);
  }

  public async set(key: string, value: TRedisValue) {
    await this.redisClient.set(key, value);
  }

  public async getTtl(key: string) {
    return await this.redisClient.ttl(key);
  }

  public async incr(key: string) {
    await this.redisClient.incr(key);
  }

  public async expire(key: string, time = 60) {
    await this.redisClient.expire(key, time);
  }
}
