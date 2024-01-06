import { DirectionEntity } from '@entities/direction/direction.entity';
import { ResultTechnicalTestEntity } from '@entities/technical-test-result/result-test.entity';
import { TestEntity } from '@entities/testing/tests.entity';
import { UserEntity } from '@entities/users/users.entity';
import { JwtGuardsModule } from '@guards/jwtGuard/jwt-guard.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InternshipStreamController } from './internship-stream.controller';
import { InternshipStreamEntity } from './internship-stream.entity';
import { InternshipStreamService } from './internship-stream.service';
import { GoogleDriveModule } from '@entities/google-drive/google-drive.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InternshipStreamEntity,
      DirectionEntity,
      UserEntity,
      TestEntity,
      ResultTechnicalTestEntity,
    ]),
    JwtGuardsModule,
    GoogleDriveModule
  ],
  providers: [InternshipStreamService, ConfigService],
  controllers: [InternshipStreamController],
  exports: [InternshipStreamService],
})
export class InternshipStreamModule {}
