import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config.module';

@Module({
  imports: [
    ConfigModule,
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    }),
  ],
})
export class RedisCacheModule {}
