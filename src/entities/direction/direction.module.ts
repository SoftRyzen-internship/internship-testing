import { JwtAuthGuard } from '@guards/jwtGuard/jwt-auth.guard';
import { JwtGuardsModule } from '@guards/jwtGuard/jwt-guard.module';
import { RoleGuard } from '@guards/roleGuard/role.guard';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectionController } from './direction.controller';
import { Direction } from './direction.entity';
import { DirectionService } from './direction.service';

@Module({
  imports: [TypeOrmModule.forFeature([Direction]), JwtGuardsModule],
  controllers: [DirectionController],
  providers: [
    DirectionService,
    ConfigService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
  ],
})
export class DirectionModule {}
