import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DashboardController } from './dashboard.controller';

import { JwtGuardsModule } from '@guards/jwtGuard/jwt-guard.module';

import { DashboardService } from './dashboard.service';

import { StreamEntity } from '@entities/streams/streams.entity';
import { ResultTechnicalTestEntity } from '@entities/tech-test-results/tech-test-results.entity';
import { UserEntity } from '@entities/users/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      StreamEntity,
      ResultTechnicalTestEntity,
    ]),
    JwtGuardsModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService, ConfigService],
})
export class DashboardModule {}
