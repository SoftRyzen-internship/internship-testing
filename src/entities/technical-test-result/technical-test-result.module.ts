import { GoogleDriveModule } from '@entities/google-drive/google-drive.module';
import { InternshipStreamEntity } from '@entities/internship-stream/internship-stream.entity';
import { TechnicalTestModule } from '@entities/technical-test/technical-test.module';
import { UserEntity } from '@entities/users/users.entity';
import { JwtGuardsModule } from '@guards/jwtGuard/jwt-guard.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultTechnicalTestEntity } from './result-test.entity';
import { TechnicalTestResultController } from './technical-test-result.controller';
import { TechnicalTestResultService } from './technical-test-result.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ResultTechnicalTestEntity,
      UserEntity,
      InternshipStreamEntity,
    ]),
    JwtGuardsModule,
    TechnicalTestModule,
    GoogleDriveModule,
  ],
  controllers: [TechnicalTestResultController],
  providers: [TechnicalTestResultService, ConfigService],
})
export class TechnicalTestResultModule {}
