import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialsController } from './materials.controller';
import { MaterialsEntity } from './materials.entity';
import { MaterialsService } from './materials.service';

@Module({
  imports: [TypeOrmModule.forFeature([MaterialsEntity])],
  controllers: [MaterialsController],
  providers: [MaterialsService],
})
export class MaterialsModule {}
