import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { TestsService } from './tests.service';
import { TestController } from './tests.controller';
import { Test } from './tests.entity';
import { JwtGuardsModule } from '@guards/jwtGuard/jwt-guard.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports:[TypeOrmModule.forFeature([Test]), JwtGuardsModule],
  providers: [TestsService, ConfigService],
  controllers: [TestController]
})
export class TestsModule {}
