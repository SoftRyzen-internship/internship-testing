import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TechnicalTestResultController } from './technical-test-result.controller';

import { TechnicalTestResultService } from './technical-test-result.service';

import { StreamEntity } from '@entities/streams/streams.entity';
import { ResultTechnicalTestEntity } from '@entities/tech-test-results/tech-test-results.entity';
import { UserEntity } from '@entities/users/users.entity';

import { JwtGuardsModule } from '@guards/jwtGuard/jwt-guard.module';
import { GoogleDriveModule } from '../google-drive/google-drive.module';
import { TechnicalTestModule } from '../technical-test/technical-test.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ResultTechnicalTestEntity,
      UserEntity,
      StreamEntity,
    ]),
    JwtGuardsModule,
    TechnicalTestModule,
    GoogleDriveModule,
  ],
  controllers: [TechnicalTestResultController],
  providers: [TechnicalTestResultService, ConfigService],
})
export class TechnicalTestResultModule {}
