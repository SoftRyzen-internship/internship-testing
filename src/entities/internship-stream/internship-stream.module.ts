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
  ],
  providers: [InternshipStreamService, ConfigService],
  controllers: [InternshipStreamController],
  exports: [InternshipStreamService],
})
export class InternshipStreamModule {}
