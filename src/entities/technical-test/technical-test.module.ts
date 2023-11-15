import { InternshipStreamModule } from '@entities/internship-stream/internship-stream.module';
import { UserEntity } from '@entities/users/users.entity';
import { JwtGuardsModule } from '@guards/jwtGuard/jwt-guard.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnicalTestController } from './technical-test.controller';
import { TechnicalTestEntity } from './technical-test.entity';
import { TechnicalTestService } from './technical-test.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TechnicalTestEntity, UserEntity]),
    JwtGuardsModule,
    InternshipStreamModule,
  ],
  controllers: [TechnicalTestController],
  providers: [TechnicalTestService, ConfigService],
  exports: [TechnicalTestService],
})
export class TechnicalTestModule {}
