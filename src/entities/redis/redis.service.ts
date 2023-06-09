import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisCacheService {
  private readonly client: Redis;
  constructor(private readonly redisClient: RedisService) {
    this.client = this.redisClient.getClient();
  }

  async get(key: string) {
    return await this.client.get(key);
  }

  async set(key: string, value: string) {
    await this.client.set(key, value);
  }

  async del(key: string) {
    await this.client.del(key);
  }
}
