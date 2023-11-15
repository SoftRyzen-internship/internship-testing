import { InternshipStreamEntity } from '@entities/internship-stream/internship-stream.entity';
import { ResultTechnicalTestEntity } from '@entities/technical-test-result/result-test.entity';
import { UserEntity } from '@entities/users/users.entity';
import { JwtGuardsModule } from '@guards/jwtGuard/jwt-guard.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      InternshipStreamEntity,
      ResultTechnicalTestEntity,
    ]),
    JwtGuardsModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService, ConfigService],
})
export class DashboardModule {}
