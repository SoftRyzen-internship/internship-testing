import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TechnicalTestController } from './technical-test.controller';

import { TechnicalTestService } from './technical-test.service';

import { TechnicalTestEntity } from '@entities/tech-tests/tech-test.entity';
import { UserEntity } from '@entities/users/users.entity';

import { JwtGuardsModule } from '@guards/jwtGuard/jwt-guard.module';
import { StreamModule } from '../stream/stream.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TechnicalTestEntity, UserEntity]),
    JwtGuardsModule,
    StreamModule,
  ],
  controllers: [TechnicalTestController],
  providers: [TechnicalTestService, ConfigService],
  exports: [TechnicalTestService],
})
export class TechnicalTestModule {}
