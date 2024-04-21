import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StreamController } from './stream.controller';

import { StreamService } from './stream.service';

import { DirectionEntity } from '@entities/directions/directions.entity';
import { StreamEntity } from '@entities/streams/streams.entity';
import { ResultTechnicalTestEntity } from '@entities/tech-test-results/tech-test-results.entity';
import { TestEntity } from '@entities/testing/testing.entity';
import { UserEntity } from '@entities/users/users.entity';

import { JwtGuardsModule } from '@guards/jwtGuard/jwt-guard.module';
import { GoogleDriveModule } from '../google-drive/google-drive.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StreamEntity,
      DirectionEntity,
      UserEntity,
      TestEntity,
      ResultTechnicalTestEntity,
    ]),
    JwtGuardsModule,
    GoogleDriveModule,
  ],
  providers: [StreamService, ConfigService],
  controllers: [StreamController],
  exports: [StreamService],
})
export class StreamModule {}
