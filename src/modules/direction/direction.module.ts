import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DirectionController } from './direction.controller';

import { DirectionService } from './direction.service';

import { JwtGuardsModule } from '@guards/jwtGuard/jwt-guard.module';
import { RoleGuardsModule } from '@guards/roleGuard/role.module';

import { JwtAuthGuard } from '@guards/jwtGuard/jwt-auth.guard';
import { RoleGuard } from '@guards/roleGuard/role.guard';

import { DirectionEntity } from '@entities/directions/directions.entity';
import { StreamEntity } from '@entities/streams/streams.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DirectionEntity, StreamEntity]),
    JwtGuardsModule,
    RoleGuardsModule,
  ],
  controllers: [DirectionController],
  providers: [DirectionService, ConfigService, JwtAuthGuard, RoleGuard],
})
export class DirectionModule {}
