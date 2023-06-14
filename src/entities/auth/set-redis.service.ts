import { RedisCacheService } from '@entities/redis/redis.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class SetRedisService {
  private readonly MAX_LOGIN_ATTEMPTS = 4;
  constructor(private readonly redisCacheService: RedisCacheService) {}

  public async attempts(key: string) {
    const currentAttempts = Number(
      await this.redisCacheService.get(`login-attempts:${key}`),
    );

    if (currentAttempts >= this.MAX_LOGIN_ATTEMPTS) {
      const timeToLive = await this.redisCacheService.getTtl(
        `login-attempts:${key}`,
      );
      throw new HttpException(
        `Too many failed login attempts. Please try again after 15 minutes. Time left ${this.timeFormat(
          timeToLive,
        )}`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    await this.redisCacheService.incr(`login-attempts:${key}`);
    await this.redisCacheService.expire(`login-attempts:${key}`, 900);
  }

  public async setRefreshToken(key: string, value: string) {
    await this.redisCacheService.set(`refreshToken:${key}`, value);
  }

  private timeFormat(seconds: number) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }
}
