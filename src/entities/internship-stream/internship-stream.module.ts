import { JwtGuardsModule } from '@guards/jwtGuard/jwt-guard.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InternshipStreamController } from './internship-stream.controller';
import { InternshipStream } from './internship-stream.entity';
import { InternshipStreamService } from './internship-stream.service';

@Module({
  imports: [TypeOrmModule.forFeature([InternshipStream]), JwtGuardsModule],
  providers: [InternshipStreamService, ConfigService],
  controllers: [InternshipStreamController],
})
export class InternshipStreamModule {}
