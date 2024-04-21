import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtGuardsModule } from '@guards/jwtGuard/jwt-guard.module';

import { MaterialsController } from './materials.controller';

import { MaterialsService } from './materials.service';

import { MaterialsEntity } from '@entities/materials/materials.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MaterialsEntity]), JwtGuardsModule],
  controllers: [MaterialsController],
  providers: [MaterialsService, ConfigService],
})
export class MaterialsModule {}
